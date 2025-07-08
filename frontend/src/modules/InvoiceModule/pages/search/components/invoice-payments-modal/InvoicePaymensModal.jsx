import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Row,
    Col,
    InputNumber,
    DatePicker,
    Select,
    Button,
} from "antd";
import dayjs from "dayjs";
import { t } from "../../../../../../customHooks/useTranslation";
import FloatingLabel from "../../../../../../components/common/floatingLabel/FloatingLabel";
import {
    showNotification,
    NOTIFICATION_TYPE,
} from "../../../../../../components/common/notification/Notification";
import { set_invoice_payments } from "../../../../../../services/api/general/general";
import { formatNumberES } from "../../../../../../services/utils";

const PAYMENT_METHODS = ["TRANSF", "CASH"];

export const InvoicePaymentsModal = ({ invoice, setInvoice, refreshData }) => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);
    const [submitting, setSubmitting] = useState(false);

    const onFinish = async (values) => {
        try {
            setSubmitting(true);
            const data = {
                payments: [
                    {
                        date: dayjs(values.date).format("YYYY-MM-DD"),
                        amount: values.amount,
                        method: values.method,
                    },
                ],
            };

            await set_invoice_payments(invoice._id, data);
            refreshData();
            showNotification(
                NOTIFICATION_TYPE.SUCCESS,
                t("success-uploading-payments-lbl"),
                `${dayjs(values.date).format(
                    "DD/MM"
                )} - ${formatNumberES(amount)} - ${values.method} `
            );
            setInvoice(null);
            form.resetFields();
        } catch (error) {
            showNotification(
                NOTIFICATION_TYPE.ERROR,
                t("error-uploading-payments-lbl"),
                error
            );
        } finally {
            setSubmitting(false);
        }
    };

    const resetModal = () => {
        setInvoice(null);
        form.resetFields();
    };

    return (
        <Modal
            open={!!invoice}
            onCancel={() => resetModal()}
            title={`Registrar pago ${invoice.number}`}
            footer={null}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                initialValues={{
                    method: PAYMENT_METHODS[0],
                    date: dayjs()
                }}
            >
                <Row style={{ marginTop: "2rem" }} gutter={16}>
                    <Col span={8}>
                        <FloatingLabel value={formValues?.date} label={t("date-lbl")}>
                            <Form.Item
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: "La fecha es obligatoria",
                                    },
                                    {
                                        validator: (_, value) =>
                                            value &&
                                            value.isAfter(dayjs(), "day")
                                                ? Promise.reject(
                                                      "La fecha no puede ser futura"
                                                  )
                                                : Promise.resolve(),
                                    },
                                ]}
                            >
                                <DatePicker
                                    inputReadOnly
                                    format={"DD/MM/YY"}
                                    style={{ width: "100%" }}
                                    disabledDate={(current) =>
                                        current &&
                                        current > dayjs().endOf("day")
                                    }
                                    placeholder=""
                                />
                            </Form.Item>
                        </FloatingLabel>
                    </Col>

                    <Col span={8}>
                        <FloatingLabel
                            value={formValues?.amount}
                            label={t("amount-lbl")}
                        >
                            <Form.Item
                                name="amount"
                                rules={[
                                    {
                                        required: true,
                                        message: "El importe es obligatorio",
                                    },
                                    {
                                        type: "number",
                                        min: 1,
                                        message: "Debe ser mayor a 0",
                                    },
                                    {
                                        validator: (_, value) =>
                                            value > invoice.total
                                                ? Promise.reject(
                                                      "El importe no puede superar el total del comprobante"
                                                  )
                                                : Promise.resolve(),
                                    },
                                ]}
                            >
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </FloatingLabel>
                    </Col>

                    <Col span={8}>
                        <FloatingLabel
                            value={formValues?.method}
                            label={t("method-lbl")}
                        >
                            <Form.Item
                                name="method"
                                rules={[
                                    {
                                        required: true,
                                        message: "Seleccione un método",
                                    },
                                ]}
                            >
                                <Select>
                                    {PAYMENT_METHODS.map((method) => (
                                        <Select.Option
                                            key={method}
                                            value={method}
                                        >
                                            {method}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </FloatingLabel>
                    </Col>

                    <Col span={24} style={{ textAlign: "right" }}>
                        <Button
                            htmlType="submit"
                            loading={submitting}
                            type="primary"
                            ghost
                        >
                            {t("submit-btn")}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
