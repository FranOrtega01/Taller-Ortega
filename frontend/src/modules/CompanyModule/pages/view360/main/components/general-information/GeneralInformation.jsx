import React, { useEffect, useState } from "react";
import { Form, Input, Button, Col, Row } from "antd";
import FloatingLabel from "../../../../../../../components/common/floatingLabel/FloatingLabel";
import moment from "moment";
import { update_client } from "../../../../../../../services/api/general/general";

const { TextArea } = Input;

export const GeneralInformation = ({ data }) => {
    const [form] = Form.useForm();
    console.log(data);

    useEffect(() => {
        form.setFieldsValue(data);
    }, [data]);

    async function onFinish(values) {
        try {
            console.log(values);
            const payload = {
                id: values?.id,
                name: values?.name,
                lastname: values?.lastname,
                emails,
                phones,
                observations,
            };
            await update_client(data._id, payload);
        } catch (error) {
            console.log(error);
        }
    }
    const name = Form.useWatch("name", form);
    const lastname = Form.useWatch("lastname", form);
    const address = Form.useWatch(["adress", "adress"], form);
    const city = Form.useWatch(["adress", "city"], form);
    const province = Form.useWatch(["adress", "province"], form);
    const phones = Form.useWatch("phones", form);
    const emails = Form.useWatch("emails", form);
    const observations = Form.useWatch("observations", form);

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Row style={{ gap: "1rem" }}>
                <FloatingLabel label="ID" value={data?.id}>
                    <Form.Item name="id">
                        <Input />
                    </Form.Item>
                </FloatingLabel>
                <FloatingLabel label="Nombre" value={name}>
                    <Form.Item name="name">
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="Apellido" value={lastname}>
                    <Form.Item name="lastname">
                        <Input />
                    </Form.Item>
                </FloatingLabel>
            </Row>
            <Row style={{ gap: "1rem" }}>
                <FloatingLabel label="Provincia" value={province}>
                    <Form.Item name={["adress", "province"]}>
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="Ciudad" value={city}>
                    <Form.Item name={["adress", "city"]}>
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="Dirección" value={address}>
                    <Form.Item name={["adress", "adress"]}>
                        <Input />
                    </Form.Item>
                </FloatingLabel>
            </Row>

            <Form.List name="phones">
                {(fields) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Row style={{ gap: "1rem" }} key={key}>
                                <FloatingLabel
                                    label="Etiqueta Teléfono"
                                    value={phones?.[key]?.name}
                                >
                                    <Form.Item name={[name, "name"]}>
                                        <Input />
                                    </Form.Item>
                                </FloatingLabel>
                                <FloatingLabel
                                    label="Teléfono"
                                    value={phones?.[key]?.phone}
                                >
                                    <Form.Item name={[name, "phone"]}>
                                        <Input />
                                    </Form.Item>
                                </FloatingLabel>
                            </Row>
                        ))}
                    </>
                )}
            </Form.List>

            <Form.List name="emails">
                {(fields) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Row style={{ gap: "1rem" }} key={key}>
                                <FloatingLabel
                                    key={key}
                                    label={`Email ${key + 1}`}
                                    value={emails?.[key]}
                                >
                                    <Form.Item name={name}>
                                        <Input />
                                    </Form.Item>
                                </FloatingLabel>
                            </Row>
                        ))}
                    </>
                )}
            </Form.List>

            <Form.List name="observations">
                {(fields) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Row style={{ gap: "1rem" }} key={key}>
                                <Col span={11}>
                                    <FloatingLabel
                                        label={moment(
                                            observations?.[key]?.date
                                        ).format("DD/MM/YY")}
                                        value={observations?.[key]?.observation}
                                    >
                                        <Form.Item name={[name, "observation"]}>
                                            <TextArea />
                                        </Form.Item>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        ))}
                    </>
                )}
            </Form.List>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Guardar
                </Button>
            </Form.Item>
        </Form>
    );
};
