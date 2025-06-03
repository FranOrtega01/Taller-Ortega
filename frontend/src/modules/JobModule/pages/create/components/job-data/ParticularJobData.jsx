import React, { useEffect } from "react";
import { Button, Col, Form, Input, Row, DatePicker } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import FloatingLabel from "../../../../../../components/common/floatingLabel/FloatingLabel";
import { useJob } from "../../../../contexts/jobContext";
import { t } from "../../../../../../customHooks/useTranslation";

const panels = ["bodyWork", "paintWork", "glassWork", "otherWork"];

export const JobData = () => {
    const {
        stepBack,
        submitting,
        setSubmitting,
        step,
        getFormInitialsFromContext,
        saveJobData,
        jobData,
        Footer,
    } = useJob();
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);

    const onFinish = async (values) => {
        await saveJobData(values);
    };

    useEffect(() => {
        const initial = getFormInitialsFromContext(3, jobData);
        console.log("initial", initial);

        form.setFieldsValue(initial);
    }, []);

    useEffect(() => {
        const amount = parseFloat(form.getFieldValue("amount") || 0);
        const iva = amount * 0.21;
        form.setFieldsValue({
            iva: iva.toFixed(2),
            total: (amount + iva).toFixed(2),
        });
    }, [formValues?.amount]);

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <h3>Trabajo Particular</h3>

            <Row gutter={16}>
                <Col span={8}>
                    <FloatingLabel label="Fecha" value={formValues?.date}>
                        <Form.Item name="date">
                            <DatePicker
                                placeholder=""
                                style={{ width: "100%" }}
                                format={"DD/MM/YY"}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={8}>
                    <FloatingLabel
                        label="Fecha Ingreso"
                        value={formValues?.entryDate}
                    >
                        <Form.Item name="entryDate">
                            <DatePicker
                                placeholder=""
                                style={{ width: "100%" }}
                                format={"DD/MM/YY"}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={8}>
                    <FloatingLabel
                        label="Descripción General"
                        value={formValues?.description}
                    >
                        <Form.Item name="description">
                            <Input.TextArea autoSize />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={6}>
                    <FloatingLabel label="Valor" value={formValues?.amount}>
                        <Form.Item name="amount">
                            <Input type="number" />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={6}>
                    <FloatingLabel label="IVA" value={formValues?.iva}>
                        <Form.Item name="iva">
                            <Input disabled />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={6}>
                    <FloatingLabel label="Total" value={formValues?.total}>
                        <Form.Item name="total">
                            <Input disabled />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
            </Row>

            <h4>Repuestos</h4>
            <Form.List name="parts">
                {(fields, { add }) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Row gutter={16} key={key}>
                                <Col>
                                    <FloatingLabel
                                        label="Repuesto"
                                        value={formValues?.parts?.[key]?.name}
                                    >
                                        <Form.Item name={[name, "name"]}>
                                            <Input />
                                        </Form.Item>
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel
                                        label="Cantidad"
                                        value={
                                            formValues?.parts?.[key]?.quantity
                                        }
                                    >
                                        <Form.Item name={[name, "quantity"]}>
                                            <Input type="number" />
                                        </Form.Item>
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel
                                        label="Proveedor"
                                        value={
                                            formValues?.parts?.[key]?.supplier
                                        }
                                    >
                                        <Form.Item name={[name, "supplier"]}>
                                            <Input />
                                        </Form.Item>
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel
                                        label="dateRequested"
                                        value={
                                            formValues?.parts?.[key]
                                                ?.dateRequested
                                        }
                                    >
                                        <Form.Item
                                            name={[name, "dateRequested"]}
                                        >
                                            <DatePicker
                                                placeholder=""
                                                style={{ width: "100%" }}
                                                format={"DD/MM/YY"}
                                            />
                                        </Form.Item>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        ))}
                        <Button
                            icon={<PlusCircleOutlined />}
                            type="link"
                            onClick={() => add()}
                        >
                            Agregar Repuesto
                        </Button>
                    </>
                )}
            </Form.List>

            <h4>Paños</h4>
            {panels.map((p, index) => (
                <Row gutter={16} key={index}>
                    <Col span={4}>
                        <FloatingLabel
                            label={`Cantidad ${t(p)}`}
                            value={formValues?.panels?.[index]?.quantity}
                        >
                            <Form.Item name={["panels", index, "quantity"]}>
                                <Input type="number" />
                            </Form.Item>
                        </FloatingLabel>
                    </Col>
                    <Col span={4}>
                        <FloatingLabel
                            label="Valor"
                            value={formValues?.panels?.[index]?.amount}
                        >
                            <Form.Item name={["panels", index, "amount"]}>
                                <Input type="number" />
                            </Form.Item>
                        </FloatingLabel>
                    </Col>
                </Row>
            ))}
            <Footer />
        </Form>
    );
};
