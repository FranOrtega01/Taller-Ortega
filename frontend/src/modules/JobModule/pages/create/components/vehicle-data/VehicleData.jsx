import React, { useState, useEffect } from "react";
import { useJob } from "../../../../contexts/jobContext";
import { Button, Input, Form, Row, Col } from "antd";
import FloatingLabel from "../../../../../../components/common/floatingLabel/FloatingLabel";
import { t } from "../../../../../../customHooks/useTranslation";
export const VehicleData = () => {
    const {
        step,
        stepBack,
        renderSelectedStep,
        submitting,
        setSubmitting,
        jobData,
        saveJobData,
        getFormInitialsFromContext,
        Footer,
    } = useJob();
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);

    const onFinish = async (values) => {
        await saveJobData(values);
    };

  useEffect(() => {
    const initial = getFormInitialsFromContext(1, jobData);
    form.setFieldsValue(initial);
}, []);

    return (
        <Form form={form} onFinish={onFinish}>
            <div>VehicleData</div>
            <Col span={6}>
                <FloatingLabel
                    label={t("vehicle-license-plate-lbl")}
                    value={formValues?.licensePlate}
                >
                    <Form.Item
                        name="licensePlate"
                        rules={[
                            {
                                // required: true,
                                // message: t("field-required-lbl"),
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>
                </FloatingLabel>
            </Col>

            <Footer />
        </Form>
    );
};
