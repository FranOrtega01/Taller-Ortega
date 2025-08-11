import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Flex, Tooltip, Modal } from "antd";
import { get_invoices } from "../../../../services/api/general/general";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../components/common/layout";
import { Dot } from "../../../../components/common/dot/Dot";
import {
    formatCUIT,
    formatNumberES,
    invoicePaymentStatusColor,
    invoiceStatusColor,
    formatLicense,
} from "../../../../services/utils";
import { Filters } from "./filters/Filters";
import { InvoicePaymentsModal } from "./components/invoice-payments-modal/InvoicePaymensModal";
import { t } from "../../../../customHooks/useTranslation";

const Search = () => {
    const [invoices, setInvoices] = useState([]);
    const [totalItems, setTotalItems] = useState();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [paymentModal, setPaymentModal] = useState(null);

    const fetchInvoices = async (
        currentPage = page,
        currentPageSize = pageSize,
        currentFilters = filters
    ) => {
        setLoading(true);
        const data = await get_invoices(
            currentPage,
            currentPageSize,
            currentFilters
        );
        console.log(data);

        setInvoices(formatInvoices(data?.payload?.data || []));
        setTotalItems(data?.payload?.totalItems || 0);
        setLoading(false);
    };

    const formatInvoices = (invoices) => {
        return invoices?.map((invoice) => ({
            ...invoice,
            total: invoice?.amount + invoice?.iva,
            paidAmount: invoice?.payments?.reduce(
                (sum, p) => sum + (p.amount || 0),
                0
            ),
        }));
    };

    const getDays = (date) => {
        const today = moment();
        const issuedDate = moment(date);
        return today.diff(issuedDate, "days");
    };

    const handleOriginNavigation = (record) => {
        if (record?.origin?.type === "JOB")
            navigate(`/trabajos/view/${record?.origin?.data.id}`);
    };

    useEffect(() => {
        fetchInvoices();
    }, [page, pageSize, filters]);

    const columns = [
        {
            title: "#",
            key: "index",
            width: 20,
            align: "center",
            render: (_, record) => (
                <Tooltip
                    title={
                        !record.paidAmount
                            ? `${"since-lbl"} ${getDays(record.issueDate)} ${t(
                                  "days-lbl"
                              )}`
                            : `${"paid-on-lbl"} ${moment(
                                  record.payments?.[0].date
                              ).format("DD/MM/YY")}`
                    }
                >
                    <div>
                        <Dot
                            size={12}
                            color={invoicePaymentStatusColor(
                                record.issueDate,
                                record.paidAmount
                            )}
                        />
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Date",
            dataIndex: "issueDate",
            key: "issueDate",
            render: (date) => moment(date).format("DD/MM/YY"),
        },
        {
            title: "N° Venta",
            dataIndex: "posNumber",
            key: "posNumber",
            width: 75,
        },
        {
            title: "Code",
            dataIndex: ["code", "name"],
            key: "code",
        },
        {
            title: "Number",
            dataIndex: "number",
            key: "number",
        },

        {
            title: "Razon Social",
            dataIndex: "fiscalName",
            key: "fiscalName",
            width: "15%"
        },
        {
            title: "CUIT",
            dataIndex: "cuit",
            key: "cuit",
            render: (text) => formatCUIT(text),
            width: 115,
        },
        // {
        //     title: "Amount",
        //     dataIndex: "amount",
        //     key: "amount",
        //     render: (amount) => `$${amount.toFixed(2)}`,
        // },
        // {
        //     title: "IVA",
        //     dataIndex: "iva",
        //     key: "iva",
        //     render: (iva) => `$${iva.toFixed(2)}`,
        // },
        {
            title: "Total",
            key: "total",
            render: (record) => `$${formatNumberES(record.total)}`,
        },
        {
            title: "Paid Amount",
            key: "paidAmount",
            render: (record) => {
                return `$${formatNumberES(record.paidAmount)}`;
            },
        },
        {
            title: "Payment Date",
            key: "paymentDate",
            render: (_, record) =>
                record.payments?.[0]
                    ? moment(record.payments?.[0].date).format("DD/MM/YY")
                    : "-",
        },

        {
            title: "Status",
            dataIndex: ["status", "name"],
            key: "status",
            width: 100,
            render: (text, record) => (
                <Tag
                    style={{ width: "100%", textAlign: "center" }}
                    color={invoiceStatusColor(record.status.code)}
                >
                    {text}
                </Tag>
            ),
        },
        //asdfasf
        {
            title: "Origin",
            key: "origin",
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => handleOriginNavigation(record)}
                >
                    {formatLicense(record?.origin?.data?.vehicleRef)}
                </Button>
            ),
        },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            width: 120,
            render: (_, record) => (
                <Flex vertical gap={"middle"}>
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        onClick={() => setPaymentModal(record)}
                        disabled={record?.payments?.length}
                    >
                        {t(
                            record?.payments?.length
                                ? "edit-payment-lbl"
                                : "set-payment-lbl"
                        )}
                    </Button>
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        onClick={() => {}}
                    >
                        {t("view-details-lbl")}
                    </Button>
                </Flex>
            ),
        },
    ];

    return (
        <Layout>
            <Layout.Body>
                <h1>Página de Facturacion</h1>
                <Filters
                    setFilters={(f) => {
                        setPage(1);
                        setFilters(f);
                    }}
                    loading={loading}
                />
                <Table
                    size="small"
                    bordered
                    loading={loading}
                    rowKey="_id"
                    dataSource={invoices}
                    columns={columns}
                    pagination={{
                        total: totalItems,
                        pageSize: pageSize,
                        current: page,
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                        },
                    }}
                />
                {paymentModal && (
                    <InvoicePaymentsModal
                        refreshData={fetchInvoices}
                        invoice={paymentModal}
                        setInvoice={setPaymentModal}
                    />
                )}
            </Layout.Body>
        </Layout>
    );
};

export default Search;
