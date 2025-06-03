import React, { useEffect } from "react";
import { useJob } from "../../../../contexts/jobContext";
import {
    Button,
    Input,
    Form,
    Col,
    Row,
    Checkbox,
    Select,
    DatePicker,
    Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import FloatingLabel from "../../../../../../components/common/floatingLabel/FloatingLabel";
import { t } from "../../../../../../customHooks/useTranslation";

const { Dragger } = Upload;
const { Option } = Select;

export const EstimateData = () => {
    const {
        stepBack,
        submitting,
        setSubmitting,
        saveJobData,
        jobData,
        getFormInitialsFromContext,
        step,
        Footer,
    } = useJob();
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);

    useEffect(() => {
        const initial = getFormInitialsFromContext();
        form.setFieldsValue(initial);
    }, []);

    const onFinish = async (values) => {
        await saveJobData(values);
    };

    const hasEstimate = Form.useWatch("hasEstimate", form);
    const isPaid = Form.useWatch("isPaid", form);

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Col>
                <Form.Item
                    name="hasEstimate"
                    valuePropName="checked"
                    initialValue={false}
                    rules={[
                        {
                            required: true,
                            message:
                                t("field-required-lbl") ||
                                "Este campo es obligatorio",
                        },
                    ]}
                >
                    <Checkbox>
                        {t("has-estimate-lbl") || "¿Tiene Presupuesto?"}
                    </Checkbox>
                </Form.Item>
            </Col>
            <Col span={4}>
                <FloatingLabel label="Fecha Presu" value={formValues?.date}>
                    <Form.Item
                        name="date"
                        rules={[
                            {
                                required: hasEstimate,
                                message:
                                    t("field-required-lbl") ||
                                    "La fecha de presupuesto es requerida",
                            },
                        ]}
                    >
                        <DatePicker
                            placeholder=""
                            style={{ width: "100%" }}
                            disabled={!hasEstimate}
                            format={"DD/MM/YY"}
                        />
                    </Form.Item>
                </FloatingLabel>
            </Col>
            <Row style={{ marginTop: "1rem", gap: "1rem" }}>
                <Col span={4}>
                    <FloatingLabel label="Monto" value={formValues?.amount}>
                        <Form.Item
                            name="amount"
                            rules={[
                                {
                                    required: hasEstimate,
                                    message:
                                        t("field-required-lbl") ||
                                        "El monto es requerido",
                                },
                            ]}
                        >
                            <Input type="number" disabled={!hasEstimate} />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Form.Item
                    name="isPaid"
                    valuePropName="checked"
                    initialValue={false}
                    rules={[
                        {
                            required: hasEstimate,
                            message:
                                t("field-required-lbl") ||
                                "Debes indicar si fue pagado",
                        },
                    ]}
                >
                    <Checkbox disabled={!hasEstimate}>
                        {t("is-paid-lbl") || "¿Pago?"}
                    </Checkbox>
                </Form.Item>
                <Col span={4}>
                    <FloatingLabel
                        label="Fecha Pago"
                        value={formValues?.paymentDate}
                    >
                        <Form.Item
                            name="paymentDate"
                            rules={[
                                {
                                    required: hasEstimate && isPaid,
                                    message:
                                        t("field-required-lbl") ||
                                        "La fecha de pago es requerida",
                                },
                            ]}
                        >
                            <DatePicker
                                placeholder=""
                                style={{ width: "100%" }}
                                disabled={!hasEstimate || !isPaid}
                                format={"DD/MM/YY"}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
                <Col span={4}>
                    <FloatingLabel
                        label="Método"
                        value={formValues?.paymentMethod}
                    >
                        <Form.Item
                            name="paymentMethod"
                            rules={[
                                {
                                    required: hasEstimate && isPaid,
                                    message:
                                        t("field-required-lbl") ||
                                        "El método de pago es requerido",
                                },
                            ]}
                        >
                            <Select
                                placeholder=""
                                disabled={!hasEstimate || !isPaid}
                            >
                                <Option value="TRANS">Transferencia</Option>
                                <Option value="CASH">Efectivo</Option>
                            </Select>
                        </Form.Item>
                    </FloatingLabel>
                </Col>
            </Row>

            <Form.Item
                name="files"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
                <Dragger disabled={!hasEstimate} multiple>
                    <p className="ant-upload-text">
                        {t("upload-instructions") ||
                            "Arrastra imágenes aquí o haz click para seleccionar"}
                    </p>
                </Dragger>
            </Form.Item>

            <Footer />
        </Form>
    );
};
