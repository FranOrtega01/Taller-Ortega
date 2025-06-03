import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Button, Modal } from "antd";
import FloatingLabel from "../../../../components/common/floatingLabel/FloatingLabel";
import { create_new_vehicle } from "../../../../services/api/general/general";
import { Title } from "./styles";
import { t } from "../../../../customHooks/useTranslation";
import { useNavigate } from "react-router-dom";
export const Create = () => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            console.log(values);
            const data = {
                licensePlate: values?.licensePlate,
                owner: values?.id,
                year: values?.year,
                brand: values?.brand,
                model: values?.model,
                color: values?.color,
            };
            await create_new_vehicle(data)
        } catch (error) {
            console.log(error);
        }                    
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Title>{t("owner-data-lbl")}</Title>
            <Row style={{ gap: "1rem" }}>
                <FloatingLabel label="DNI" value={formValues?.id}>
                    <Form.Item name="id">
                        <Input />
                    </Form.Item>
                </FloatingLabel>
            </Row>
            <Title>{t("vehicle-data-lbl")}</Title>
            <Row style={{ gap: "1rem" }}>
                <FloatingLabel
                    label="LicensePlate"
                    value={formValues?.licensePlate}
                >
                    <Form.Item name="licensePlate">
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="year" value={formValues?.year}>
                    <Form.Item name="year">
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="brand" value={formValues?.brand}>
                    <Form.Item name="brand">
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="model" value={formValues?.model}>
                    <Form.Item name="model">
                        <Input />
                    </Form.Item>
                </FloatingLabel>

                <FloatingLabel label="color" value={formValues?.color}>
                    <Form.Item name="color">
                        <Input />
                    </Form.Item>
                </FloatingLabel>
            </Row>
            <Button variant="ghost" onClick={() => navigate(-1)}>
                {t("create-btn")}
            </Button>
            <Button type="primary" htmlType="submit">
                {t("create-btn")}
            </Button>
        </Form>
    );
};
