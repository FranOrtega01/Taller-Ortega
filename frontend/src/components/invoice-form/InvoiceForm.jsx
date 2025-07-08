import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Flex,
    Select,
    Form,
    Input,
    InputNumber,
    Button,
    DatePicker,
} from "antd";
import { CustomInputNumber } from "../common/theme/inputs/custom-input-number/CustomInputNumber";
import dayjs from "dayjs";
import FloatingLabel from "../common/floatingLabel/FloatingLabel";
import { t } from "../../customHooks/useTranslation";
export const InvoiceForm = ({
    data,
    type,
    invoiceTypes,
    isCreditNote,
    finishAction,
}) => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);

    useEffect(() => {
        if (!data) return;
    }, [data]);

    useEffect(() => {
        const total = parseFloat(formValues?.total) || 0;
        const amount = +(total / 1.21);
        const iva = +(amount * 0.21);

        form.setFieldsValue({ iva: iva.toFixed(2), amount: amount.toFixed(2) });
    }, [formValues?.total]);

    const handleFinish = async (values) => {
        let payload = {
            ...values,
        };
        if (type === "CLAIM") {
            payload.claimId = data.claimId;
        }

        if (type === "JOB") {
            payload.jobId = data.jobId;
        }
        finishAction(payload);
    };

    return (
        <Form
            form={form}
            onFinish={handleFinish}
            initialValues={{
                posNumber: 2,
                cuit: data?.cuit,
                date: dayjs(),
                amount: 0,
                iva: 0,
                total: data?.total,
                description: data?.description,
            }}
        >
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <FloatingLabel
                        label={t("invoice-type-lbl")}
                        value={formValues?.code}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                            name="code"
                        >
                            <Select style={{ width: "100%" }}>
                                {invoiceTypes?.map((it) => (
                                    <Select.Option
                                        value={it.code}
                                        key={it.code}
                                    >
                                        {it.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={6}>
                    <FloatingLabel
                        label={t("invoice-number-lbl")}
                        value={formValues?.number}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                            name="number"
                        >
                            <InputNumber style={{ width: "100%" }} min={0} />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={6}>
                    <FloatingLabel
                        label={t("invoice-pos-number-lbl")}
                        value={formValues?.posNumber}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                            name="posNumber"
                        >
                            <InputNumber style={{ width: "100%" }} min={0} />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={6}>
                    <FloatingLabel
                        label={t("invoice-date-lbl")}
                        value={formValues?.date}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                            name="date"
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format={"DD/MM/YY"}
                                disabledDate={(current) =>
                                    current && current > dayjs().endOf("day")
                                }
                                placeholder=""
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={6}>
                    <FloatingLabel
                        label={t("invoice-cae-number-lbl")}
                        value={formValues?.caeNumber}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                            name="caeNumber"
                        >
                            <InputNumber style={{ width: "100%" }} min={0} />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={6}>
                    <FloatingLabel
                        label={t("invoice-cae-date-lbl")}
                        value={formValues?.caeDate}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                            name="caeDate"
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format={"DD/MM/YY"}
                                disabledDate={(current) =>
                                    current && current > dayjs().endOf("day")
                                }
                                placeholder=""
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={6}>
                    <FloatingLabel
                        label={t("invoice-cuit-lbl")}
                        value={formValues?.cuit}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                            name="cuit"
                        >
                            <Input style={{ width: "100%" }} />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={8}>
                    <FloatingLabel
                        label={t("invoice-amount-lbl")}
                        value={formValues?.amount}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                            name="amount"
                        >
                            <CustomInputNumber
                                disabled
                                prefix={"$"}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
                <Col span={8}>
                    <FloatingLabel
                        label={t("invoice-iva-lbl")}
                        value={formValues?.iva}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                            name="iva"
                        >
                            <CustomInputNumber
                                disabled
                                prefix={"$"}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
                <Col span={8}>
                    <FloatingLabel
                        label={t("invoice-total-lbl")}
                        value={formValues?.total}
                        hasPrefix={true}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                            name="total"
                        >
                            <CustomInputNumber
                                disabled={type !== "MANUAL"}
                                prefix={"$"}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
                <Col span={24}>
                    <FloatingLabel
                        label={t("invoice-description-lbl")}
                        value={formValues?.description}
                    >
                        <Form.Item
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: t("required-field-lbl"),
                                },
                            ]}
                        >
                            <Input.TextArea rows={5} />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                    <Button htmlType="submit" type="primary" ghost>
                        {t("submit-btn")}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};
