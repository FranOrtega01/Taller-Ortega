import React, { useEffect } from "react";
import { useJob } from "../../../../contexts/jobContext";
import { Button, Row, Form } from "antd";
import { t } from "../../../../../../customHooks/useTranslation";

export const AdditionalData = () => {
    const {
        step,
        stepBack,
        renderSelectedStep,
        submitting,
        setSubmitting,
        jobData,
        saveJobData,
        getFormInitialsFromContext,
        setConfirmVisible,
        Footer,
    } = useJob();

    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);

    useEffect(() => {
        const initial = getFormInitialsFromContext(step, jobData);
        form.setFieldsValue(initial);
    }, []);

    const onFinish = async (values) => {
        try {
            await saveJobData(values);
            setConfirmVisible(true)
        } catch (error) {
            
        }
    };

    return (
        <Form onFinish={onFinish} form={form}>
            <div>AdditionalData</div>
            <Footer />
        </Form>
    );
};
