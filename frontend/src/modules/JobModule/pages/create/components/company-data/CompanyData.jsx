import React, { useEffect, useState } from "react";
import { useJob } from "../../../../contexts/jobContext";
import {
    Button,
    Select,
    Form,
    Row,
    Col,
    Input,
    Checkbox,
    DatePicker,
    Upload,
} from "antd";
import FloatingLabel from "../../../../../../components/common/floatingLabel/FloatingLabel";
import { PlusCircleOutlined } from "@ant-design/icons";
import { t } from "../../../../../../customHooks/useTranslation";
import { get_companies } from "../../../../../../services/api/general/general";

const { Dragger } = Upload;

export const CompanyData = () => {
    const {
        stepBack,
        submitting,
        setSubmitting,
        getFormInitialsFromContext,
        step,
        saveJobData,
        jobData,
        Footer,
    } = useJob();
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);
    const [companies, setCompanies] = useState([]);

    const hasOrder = Form.useWatch("hasOrder", form);

    const fetchCompanies = async () => {
        try {
            const companies = await get_companies();
            const formattedCompanies = (companies?.payload ?? []).map((c) => ({
                code: c?.cuit || null,
                name: c?.name || "",
            }));
            setCompanies(formattedCompanies);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchCompanies();
        const initial = getFormInitialsFromContext(4, jobData);
        form.setFieldsValue(initial);
    }, []);

    const onFinish = async (values) => {
        await saveJobData(values);
    };

    return (
        <>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <h3>Compania</h3>
                <Row gutter={[16, 16]} style={{ marginBlock: "1rem" }}>
                    <Col span={6}>
                        <FloatingLabel
                            label={t("company-lbl")}
                            value={formValues?.company}
                        >
                            <Form.Item
                                name="company"
                                rules={[
                                    {
                                        required: true,
                                        message: t("field-required-lbl"),
                                    },
                                ]}
                            >
                                <Select placeholder="">
                                    {companies?.map((c) => (
                                        <Select.Option
                                            key={c?.code}
                                            value={c?.code}
                                        >
                                            {c?.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </FloatingLabel>
                    </Col>
                </Row>

                <h4>{t("company-orders-lbl")}</h4>
                <Row>
                    <Form.Item
                        name="hasOrder"
                        valuePropName="checked"
                        initialValue={false}
                        rules={[
                            {
                                required: true,
                                message: t("field-required-lbl"),
                            },
                        ]}
                    >
                        <Checkbox>{t("has-order-lbl")}</Checkbox>
                    </Form.Item>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: "1rem" }}>
                    <Col span={3}>
                        <FloatingLabel
                            label={t("order-date-lbl")}
                            value={formValues?.orderDate}
                        >
                            <Form.Item
                                name="orderDate"
                                rules={[
                                    {
                                        required: hasOrder,
                                        message: t("field-required-lbl"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    disabled={!hasOrder}
                                    placeholder=""
                                    style={{ width: "100%" }}
                                    format={"DD/MM/YY"}
                                />
                            </Form.Item>
                        </FloatingLabel>
                    </Col>

                    <Col span={6}>
                        <FloatingLabel
                            label={t("claim-number-lbl")}
                            value={formValues?.claimNumber}
                        >
                            <Form.Item
                                name="claimNumber"
                                rules={[
                                    {
                                        required: hasOrder,
                                        message: t("field-required-lbl"),
                                    },
                                ]}
                            >
                                <Input disabled={!hasOrder} />
                            </Form.Item>
                        </FloatingLabel>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: "1rem" }}>
                    <Col span={3}>
                        <FloatingLabel
                            label={t("order-amount-lbl")}
                            value={formValues?.orderAmount}
                        >
                            <Form.Item
                                name="orderAmount"
                                rules={[
                                    {
                                        required: hasOrder,
                                        message: t("field-required-lbl"),
                                    },
                                ]}
                            >
                                <Input type="number" disabled={!hasOrder} />
                            </Form.Item>
                        </FloatingLabel>
                    </Col>

                    <Col span={3}>
                        <FloatingLabel
                            label={t("order-iva-lbl")}
                            value={formValues?.orderIva}
                        >
                            <Form.Item
                                name="orderIva"
                                rules={[
                                    {
                                        required: hasOrder,
                                        message: t("field-required-lbl"),
                                    },
                                ]}
                            >
                                <Input type="number" disabled />
                            </Form.Item>
                        </FloatingLabel>
                    </Col>
                    <Col span={3}>
                        <FloatingLabel
                            label={t("order-deductible-lbl")}
                            value={formValues?.orderDeductible}
                        >
                            <Form.Item
                                name="orderDeductible"
                                rules={[
                                    {
                                        required: hasOrder,
                                        message: t("field-required-lbl"),
                                    },
                                ]}
                            >
                                <Input type="number" disabled={!hasOrder} />
                            </Form.Item>
                        </FloatingLabel>
                    </Col>

                    <Col span={3}>
                        <FloatingLabel
                            label={t("order-total-lbl")}
                            value={formValues?.orderTotal}
                        >
                            <Form.Item
                                name="orderTotal"
                                rules={[
                                    {
                                        required: hasOrder,
                                        message: t("field-required-lbl"),
                                    },
                                ]}
                            >
                                <Input type="number" disabled />
                            </Form.Item>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Form.List name="parts">
                    {(fields, { add }) => (
                        <>
                            {fields.map(({ key, name }) => (
                                <Row gutter={16} key={key}>
                                    <Col>
                                        <FloatingLabel
                                            label="Repuesto"
                                            value={
                                                formValues?.parts?.[key]?.name
                                            }
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
                                                formValues?.parts?.[key]
                                                    ?.quantity
                                            }
                                        >
                                            <Form.Item
                                                name={[name, "quantity"]}
                                            >
                                                <Input type="number" />
                                            </Form.Item>
                                        </FloatingLabel>
                                    </Col>
                                    <Col>
                                        <FloatingLabel
                                            label="Proveedor"
                                            value={
                                                formValues?.parts?.[key]
                                                    ?.supplier
                                            }
                                        >
                                            <Form.Item
                                                name={[name, "supplier"]}
                                            >
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
                <Form.Item
                    name="files"
                    valuePropName="fileList"
                    getValueFromEvent={(e) =>
                        Array.isArray(e) ? e : e?.fileList
                    }
                >
                    <Dragger disabled={!hasOrder} multiple>
                        <p className="ant-upload-text">
                            {t("upload-instructions") ||
                                "Arrastra imágenes aquí o haz click para seleccionar"}
                        </p>
                    </Dragger>
                </Form.Item>

                <Footer />
            </Form>
        </>
    );
};
