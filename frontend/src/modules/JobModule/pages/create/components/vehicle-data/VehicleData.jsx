import React from "react";
import { useJob } from "../../../../contexts/jobContext";
import { Button, Input, Form } from "antd";
import FloatingLabel from "../../../../../../components/common/floatingLabel/FloatingLabel";
import { t } from "../../../../../../customHooks/useTranslation";
export const VehicleData = () => {
    const { step, stepBack, renderSelectedStep, submitting, setSubmitting, saveJobData } =
        useJob();
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);

    const onFinish = async (values) => {
        setSubmitting(true);
        // console.log("Received values of form: ", values);
        //...
        setSubmitting(false);
        await saveJobData(values);
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <div>VehicleData</div>
            <FloatingLabel
                label={t("vehicle-license-plate-lbl")}
                value={formValues?.licensePlate}
            >
                <Form.Item
                    name="licensePlate"
                    rules={[
                        {
                            required: true,
                            message: t("field-required-lbl"),
                        },
                    ]}
                >
                    <Input type="text" />
                </Form.Item>
            </FloatingLabel>
            <Button onClick={stepBack}>Siguiente</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
                {t("following-btn")}
            </Button>
        </Form>
    );
};
