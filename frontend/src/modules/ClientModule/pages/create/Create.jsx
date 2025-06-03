import React, { useEffect } from "react";
import { Form, Input, Button, Col, Row } from "antd";
import FloatingLabel from "../../../../components/common/floatingLabel/FloatingLabel";
import { create_client } from "../../../../services/api/general/general";

const { TextArea } = Input;

const initialValues = {
    adress: {
        adress: "",
        city: "",
        province: "",
    },
    phones: [{ name: "", phone: "" }],
    emails: [""],
    observations: [{ observation: "" }],
};

export const Create = () => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);

    const onFinish = async (values) => {
        try {
            await create_client(values);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={initialValues}
        >
            <h3>Info Principal</h3>
            <Row style={{ gap: "1rem" }}>
                <FloatingLabel label="Nombre" value={formValues?.name}>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: "Requerido" }]}
                    >
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="Apellido" value={formValues?.lastname}>
                    <Form.Item
                        name="lastname"
                        rules={[{ required: true, message: "Requerido" }]}
                    >
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="DNI" value={formValues?.dni}>
                    <Form.Item name="dni">
                        <Input />
                    </Form.Item>
                </FloatingLabel>
            </Row>

            <h3>Info Adicional</h3>
            <Row style={{ gap: "1rem" }}>
                <FloatingLabel
                    label="Provincia"
                    value={formValues?.adress?.province}
                >
                    <Form.Item name={["adress", "province"]}>
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="Ciudad" value={formValues?.adress?.city}>
                    <Form.Item name={["adress", "city"]}>
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel
                    label="Calle"
                    value={formValues?.adress?.adress}
                >
                    <Form.Item name={["adress", "adress"]}>
                        <Input />
                    </Form.Item>
                </FloatingLabel>
            </Row>

            <Form.List name="emails">
                {(fields, { add }) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Row style={{ gap: "1rem" }} key={key}>
                                <FloatingLabel
                                    label="Email"
                                    value={formValues?.emails?.[key]}
                                >
                                    <Form.Item name={name}>
                                        <Input />
                                    </Form.Item>
                                </FloatingLabel>
                                <Button onClick={() => add()}>+</Button>
                            </Row>
                        ))}
                    </>
                )}
            </Form.List>

            <Form.List name="phones">
                {(fields, { add }) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Row style={{ gap: "1rem" }} key={key}>
                                <FloatingLabel
                                    label="Área"
                                    value={formValues?.phones?.[key]?.area}
                                >
                                    <Form.Item name={[name, "area"]}>
                                        <Input placeholder="+54" />
                                    </Form.Item>
                                </FloatingLabel>
                                <FloatingLabel
                                    label="Teléfono"
                                    value={formValues?.phones?.[key]?.phone}
                                >
                                    <Form.Item name={[name, "phone"]}>
                                        <Input placeholder="11 0000-0000" />
                                    </Form.Item>
                                </FloatingLabel>
                                <FloatingLabel
                                    label="Referencia"
                                    value={formValues?.phones?.[key]?.name}
                                >
                                    <Form.Item name={[name, "name"]}>
                                        <Input placeholder="Celu Personal" />
                                    </Form.Item>
                                </FloatingLabel>
                                <Button onClick={() => add()}>+</Button>
                            </Row>
                        ))}
                    </>
                )}
            </Form.List>

            <h3>Observaciones</h3>
            <Form.List name="observations">
                {(fields, { add }) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Row style={{ gap: "1rem" }} key={key}>
                                <FloatingLabel
                                    label="Observaciones"
                                    value={formValues?.observations?.[key]?.observation}
                                >
                                    <Form.Item name={[name, "observation"]}>
                                        <TextArea autoSize={{ minRows: 3 }} />
                                    </Form.Item>
                                </FloatingLabel>
                            </Row>
                        ))}
                    </>
                )}
            </Form.List>

                <Button type="primary" htmlType="submit">
                    Guardar
                </Button>
        </Form>
    );
};
