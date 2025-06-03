import React, { useEffect, useState } from "react";
import { Form, Input, Button, Col, Row } from "antd";
import FloatingLabel from "../../../../../../../components/common/floatingLabel/FloatingLabel";
import moment from "moment";
import { formatLicense } from "../../../../../../../services/utils.js";
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
                licensePlate: values?.id,
                brand: values?.name,
                model: values?.lastname,
                year: values?.year,
                color: values?.color,
            };

            // await update_client(data._id, payload);
        } catch (error) {
            console.log(error);
        }
    }
    const licensePlate = Form.useWatch("licensePlate", form);
    const brand = Form.useWatch("brand", form);
    const model = Form.useWatch("model", form);
    const year = Form.useWatch("year", form);
    const color = Form.useWatch("color", form);
    
    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
                <FloatingLabel label="licensePlate" value={formatLicense(data?.licensePlate)}>
                    <Form.Item name="licensePlate">
                        <Input disabled/>
                    </Form.Item>
                </FloatingLabel>
                <FloatingLabel label="brand" value={brand}>
                    <Form.Item name="brand">
                        <Input />
                    </Form.Item>
                </FloatingLabel>
                <FloatingLabel label="model" value={model}>
                    <Form.Item name="model">
                        <Input />
                    </Form.Item>
                </FloatingLabel>
                <FloatingLabel label="year" value={year}>
                    <Form.Item name="year">
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="color" value={color}>
                    <Form.Item name="color">
                        <Input />
                    </Form.Item>
                </FloatingLabel>



            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Guardar
                </Button>
            </Form.Item>
        </Form>
    );
};
