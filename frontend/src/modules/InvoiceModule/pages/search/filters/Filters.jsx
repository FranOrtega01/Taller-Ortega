import React, { useState, useEffect } from "react";
import { DatePicker, InputNumber, Form, Select, Button, Row, Col } from "antd";
const { RangePicker } = DatePicker;
import FloatingLabel from "../../../../../components/common/floatingLabel/FloatingLabel";
import { t } from "../../../../../customHooks/useTranslation";
import {
    get_invoices_types,
    get_invoices_statuses,
    get_companies,
} from "../../../../../services/api/general/general";
import moment from "moment";

const { Option } = Select;

export const Filters = ({ setFilters, loading }) => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);
    const [invoicesTypes, setInvoicesTypes] = useState([]);
    const [invoicesStatuses, setInvoicesStatuses] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [customCuit, setCustomCuit] = useState("");
    const [loadingInputsData, setLoadingInputsData] = useState(false);

    useEffect(() => {
        const fetchInputsData = async () => {
            setLoadingInputsData(true);
            try {
                const [types, statuses, companyList] = await Promise.all([
                    get_invoices_types(),
                    get_invoices_statuses(),
                    get_companies(),
                ]);
                console.log("companies: ", companyList);

                setInvoicesTypes(types.payload || []);
                setInvoicesStatuses(statuses.payload || []);
                setCompanies(companyList.payload || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoadingInputsData(false);
            }
        };
        fetchInputsData();
    }, []);

    const onFinish = (values) => {
        console.log("form values: ", values);

        const filters = {
            invoiceNumber: values.invoiceNumber
                ? `0${values.invoiceNumber}`
                : undefined,
            code: values.invoiceType || undefined,
            status: values.invoiceStatus || undefined,
            cuit: values.cuit || undefined,
        };

        if (values.jobDate) {
            filters.dateFrom = values.jobDate[0].format("YYYY-MM-DD");
            filters.dateTo = values.jobDate[1].format("YYYY-MM-DD");
        }
        setFilters(filters);
    };

    return (
        <Form
            style={{ marginBlock: "1rem" }}
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Row gutter={[16, 16]}>
                <Col span={4}>
                    <FloatingLabel
                        label={t("invoice-number-lbl")}
                        name="invoiceNumber"
                        value={formValues?.invoiceNumber}
                    >
                        <Form.Item name="invoiceNumber">
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={4}>
                    <FloatingLabel
                        label={t("invoice-type-lbl")}
                        name="invoiceType"
                        value={formValues?.invoiceType}
                    >
                        <Form.Item name="invoiceType">
                            <Select
                                style={{ width: "100%" }}
                                allowClear
                                options={invoicesTypes.map((type) => ({
                                    label: type.name,
                                    value: type.code,
                                }))}
                                loading={loading}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>

                <Col span={4}>
                    <FloatingLabel
                        label={t("invoice-status-lbl")}
                        name="invoiceStatus"
                        value={formValues?.invoiceStatus}
                    >
                        <Form.Item name="invoiceStatus">
                            <Select
                                allowClear
                                style={{ width: "100%" }}
                                options={invoicesStatuses.map((status) => ({
                                    label: status.name,
                                    value: status.code,
                                }))}
                                loading={loadingInputsData}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
                <Col span={4}>
                    <FloatingLabel
                        label={t("invoice-date-lbl")}
                        name="invoiceDate"
                        value={formValues?.invoiceDate}
                    >
                        <Form.Item name="invoiceDate">
                            <RangePicker
                                allowClear
                                format={"DD/MM/YY"}
                                placeholder={""}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </FloatingLabel>
                </Col>
                <Col span={4}>
                    <FloatingLabel
                        label={t("cuit-lbl")}
                        name="cuit"
                        value={formValues?.cuit}
                    >
                        <Form.Item name="cuit">
                            <Select
                                showSearch
                                allowClear
                                mode={undefined}
                                style={{ width: "100%" }}
                                value={customCuit}
                                onSearch={(val) => setCustomCuit(val)}
                                onChange={(val) => setCustomCuit(val)}
                                onBlur={() =>
                                    form.setFieldsValue({ cuit: customCuit })
                                }
                                optionLabelProp="label"
                                filterOption={(input, option) =>
                                    option?.label
                                        ?.toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                notFoundContent={null}
                                loading={loadingInputsData}
                            >
                                {companies.map((comp) => (
                                    <Option
                                        key={comp.cuit}
                                        value={comp.cuit}
                                        label={`${comp.name}`}
                                    >
                                        {`${comp.name}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </FloatingLabel>
                </Col>
                <Col style={{ marginLeft: "auto" }} span={3}>
                    <Button
                        style={{ marginLeft: "auto", width: "100%" }}
                        disabled={loading}
                        type="primary"
                        ghost
                        htmlType="submit"
                    >
                        Buscar
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};
