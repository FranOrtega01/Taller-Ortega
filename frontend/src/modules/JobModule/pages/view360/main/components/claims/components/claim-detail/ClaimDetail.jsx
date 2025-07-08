import React, { useState, useEffect } from "react";
import { Form, Row, Col, Input, DatePicker, Checkbox, Button, Tag } from "antd";
import FloatingLabel from "../../../../../../../../../components/common/floatingLabel/FloatingLabel";
import { FixedFooter } from "../../../../../styles";
import { t } from "../../../../../../../../../customHooks/useTranslation";
import dayjs from "dayjs";
import { CustomInputNumber } from "../../../../../../../../../components/common/theme/inputs/custom-input-number/CustomInputNumber";
import {
    activate_claim,
    create_claim_amp,
    update_active_claim,
} from "../../../../../../../../../services/api/general/general";
import {
    showNotification,
    NOTIFICATION_TYPE,
} from "../../../../../../../../../components/common/notification/Notification";

export const ClaimDetail = ({
    getClaimActionLbl,
    claim,
    getClaimLbl,
    handleOnCreateAmp,
}) => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);
    // const [canEdit, setCanEdit] = useState)

    const handleFinish = async (values) => {
        try {
            const data = {
                amount: values?.isCleas ? 0 : values.amount,
                deductible: values.deductible,
                date: values.date,
                number: values.number,
                isCleas: values.isCleas,
                insured: values.insured,
                type: claim.type,
            };

            if (claim.status.code === "PENDING") {
                await activate_claim(claim._id, data);
                showNotification(
                    NOTIFICATION_TYPE.SUCCESS,
                    t("claim-activate-success-lbl")
                );
            }

            if (claim.status.code === "TEMP") {
                await create_claim_amp(claim.root, data);
                showNotification(
                    NOTIFICATION_TYPE.SUCCESS,
                    t("claim-create-success-lbl")
                );
            }
            handleOnCreateAmp();
        } catch (error) {
            showNotification(
                NOTIFICATION_TYPE.ERROR,
                t("claim-activate-error-lbl"),
                error
            );
        }
    };

    const handleEdit = async () => {
        try {
            const data = {
                amount: formValues?.isCleas ? 0 : formValues.amount,
                deductible: formValues.deductible,
                date: formValues.date,
                number: formValues.number,
                isCleas: formValues.isCleas,
                insured: formValues.insured,
                type: claim.type,
                status: claim?.status?.code,
            };
            await update_active_claim(claim._id, data);
            handleOnCreateAmp();
            showNotification(
                NOTIFICATION_TYPE.SUCCESS,
                t("claim-update-success-lbl")
            );
        } catch (error) {
            showNotification(
                NOTIFICATION_TYPE.ERROR,
                t("claim-update-error-lbl"),
                error
            );
        }
    };

    useEffect(() => {
        form.resetFields();
    }, [claim]);

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                type: getClaimLbl(claim.type),
                date: dayjs(claim.date),
                amount: claim.amount,
                deductible: claim.deductible,
                status: claim.status?.name,
                isCleas: claim?.isCleas || false,
                number: claim?.number,
                insured: claim?.insured,
            }}
            onFinish={handleFinish}
        >
            <Tag style={{ marginBottom: "2rem" }} color="gold">
                {`${claim.status.name} ${
                    claim.status.code === "ACTIVE"
                        ? !claim.associatedInvoices.length
                            ? ` | ${t("pending-invoice-lbl")}`
                            : ` | ${t("ready-to-complete-lbl")}`
                        : ""
                }`}
            </Tag>
            <Row gutter={16}>
                <Col span={6}>
                    <FloatingLabel
                        label={"claim-type-lbl"}
                        value={formValues?.type}
                    >
                        <Form.Item name="type">
                            <Input disabled style={{ width: "100%" }} />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={6}>
                    <FloatingLabel
                        label={"claim-number-lbl"}
                        value={formValues?.number}
                        rules={[
                            {
                                required: true,
                                message: t("field-required-lbl"),
                            },
                        ]}
                    >
                        <Form.Item name="number">
                            <Input
                                disabled={
                                    claim?.type !== "MAIN" || claim?.isNew
                                }
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
                <Col span={6}>
                    <FloatingLabel
                        label={"claim-insured-lbl"}
                        value={formValues?.insured}
                        rules={[
                            {
                                required: true,
                                message: t("field-required-lbl"),
                            },
                        ]}
                    >
                        <Form.Item name="insured">
                            <Input
                                disabled={
                                    claim?.type !== "MAIN" || claim?.isNew
                                }
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={6}>
                    <FloatingLabel
                        label={"claim-date-lbl"}
                        value={formValues?.date}
                    >
                        <Form.Item
                            name="date"
                            rules={[
                                {
                                    required: true,
                                    message: t("field-required-lbl"),
                                },
                            ]}
                        >
                            <DatePicker
                                placeholder=""
                                style={{ width: "100%" }}
                                format="DD/MM/YY"
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
                <Col span={6}>
                    <FloatingLabel
                        label={"claim-amount-lbl"}
                        value={formValues?.amount}
                    >
                        <Form.Item
                            name="amount"
                            rules={[
                                {
                                    required: true,
                                    message: t("field-required-lbl"),
                                },
                                { type: "number", min: 0 },
                            ]}
                        >
                            <CustomInputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={3}>
                    <Form.Item name="isCleas" valuePropName="checked">
                        <Checkbox
                            disabled={claim?.type !== "MAIN" || claim?.isNew}
                        >
                            {t("is-cleas-lbl")}
                        </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <FloatingLabel
                        label={"claim-deductible-lbl"}
                        value={formValues?.deductible}
                    >
                        <Form.Item
                            name="deductible"
                            rules={[
                                {
                                    required: true,
                                    message: "Ingrese un deducible",
                                },
                                { type: "number", min: 0 },
                            ]}
                        >
                            <CustomInputNumber
                                disabled={
                                    claim?.type !== "MAIN" ||
                                    formValues?.isCleas ||
                                    claim?.isNew
                                }
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
            </Row>

            <FixedFooter>
                <Button type="primary" ghost onClick={() => handleEdit()}>
                    {t("edit-lbl")}
                </Button>
                <Button type="primary" htmlType="submit">
                    {getClaimActionLbl(claim.status.code)}
                </Button>
            </FixedFooter>
        </Form>
    );
};
