import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import { get_invoices } from "../../../../services/api/general/general";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../components/common/layout";
import { Dot } from "../../../../components/common/dot/Dot";
import {
    invoicePaymentStatusColor,
    invoiceStatusColor,
} from "../../../../services/utils";
import { Filters } from "./filters/Filters";
const mockInvoices = [
    {
        _id: "AS",
        number: "03",
        posNumber: "01",
        issueDate: "2023-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [
            {
                amount: 100,
                date: "2025-05-26T03:00:00.000Z",
                method: "CASH",
            },
        ],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "PAID",
            name: "Cobrada",
        },
    },
    {
        _id: "ASD",
        number: "03",
        posNumber: "01",
        issueDate: "2025-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [
            {
                amount: 100,
                date: "2025-05-26T03:00:00.000Z",
                method: "CASH",
            },
        ],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "PAID",
            name: "Cobrada",
        },
    },

    {
        _id: "ADF",
        number: "03",
        posNumber: "01",
        issueDate: "2025-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [
            {
                amount: 100,
                date: "2025-05-26T03:00:00.000Z",
                method: "CASH",
            },
        ],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "PAID",
            name: "Cobrada",
        },
    },
    {
        _id: "6ASDGf",
        number: "03",
        posNumber: "01",
        issueDate: "2025-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [
            {
                amount: 100,
                date: "2025-05-26T03:00:00.000Z",
                method: "CASH",
            },
        ],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "PAID",
            name: "Cobrada",
        },
    },
    {
        _id: "6ASDF8b54812f",
        number: "03",
        posNumber: "01",
        issueDate: "2025-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [
            {
                amount: 100,
                date: "2025-05-26T03:00:00.000Z",
                method: "CASH",
            },
        ],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "PAID",
            name: "Cobrada",
        },
    },
    {
        _id: "SDFASDG",
        number: "01",
        posNumber: "01",
        issueDate: "2001-01-01T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2001-01-01T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: null,
        payments: [],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "REJECTED",
            name: "Rechazada",
        },
    },
    {
        _id: "682e6dASDGASDG8b54812f",
        number: "03",
        posNumber: "01",
        issueDate: "2025-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [
            {
                amount: 100,
                date: "2025-05-26T03:00:00.000Z",
                method: "CASH",
            },
        ],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "PAID",
            name: "Cobrada",
        },
    },
    {
        _id: "682e6d46ASDGe3e1f59",
        number: "02",
        posNumber: "01",
        issueDate: "2025-04-23T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: null,
        payments: [],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "CANCELED",
            name: "Anulada",
        },
    },
    {
        _id: "682eASDGASDGdfb4e3e1f59",
        number: "02",
        posNumber: "01",
        issueDate: "2025-04-23T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: null,
        payments: [],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "CANCELED",
            name: "Anulada",
        },
    },
    {
        _id: "682e6ASDGb54812f",
        number: "03",
        posNumber: "01",
        issueDate: "2025-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "ISSUED",
            name: "Emitida",
        },
    },
    {
        _id: "682ASDGGS98b54812f",
        number: "03",
        posNumber: "01",
        issueDate: "2025-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "ISSUED",
            name: "Emitida",
        },
    },
    {
        _id: "682e6dASDGASDG812f",
        number: "03",
        posNumber: "01",
        issueDate: "2025-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [
            {
                amount: 100,
                date: "2025-05-26T03:00:00.000Z",
                method: "CASH",
            },
        ],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "PAID",
            name: "Cobrada",
        },
    },
    {
        _id: "682eASDGASDGAS812f",
        number: "03",
        posNumber: "01",
        issueDate: "2025-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "ISSUED",
            name: "Emitida",
        },
    },
    {
        _id: "682e6dea892c98498b54812f",
        number: "03",
        posNumber: "01",
        issueDate: "2025-05-26T03:00:00.000Z",
        caeNumber: "01",
        caeDate: "2025-05-26T03:00:00.000Z",
        description: "teset",
        cuit: "409000",
        amount: 350,
        iva: 27,
        job: null,
        claim: "67ee07edbeffd14914c15510",
        payments: [],
        __v: 0,
        code: {
            code: "A",
            name: "Factura A",
        },
        status: {
            code: "ISSUED",
            name: "Emitida",
        },
    },
];

const Search = () => {
    const [invoices, setInvoices] = useState([]);
    const [totalItems, setTotalItems] = useState();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});

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
                <Dot
                    size={12}
                    color={invoicePaymentStatusColor(
                        record.issueDate,
                        record.paidAmount
                    )}
                />
            ),
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
            title: "Date",
            dataIndex: "issueDate",
            key: "issueDate",
            render: (date) => moment(date).format("DD/MM/YY"),
        },
        {
            title: "Razon Social",
            dataIndex: "fiscalName",
            key: "fiscalName",
        },
        {
            title: "CUIT",
            dataIndex: "cuit",
            key: "cuit",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `$${amount.toFixed(2)}`,
        },
        {
            title: "IVA",
            dataIndex: "iva",
            key: "iva",
            render: (iva) => `$${iva.toFixed(2)}`,
        },
        {
            title: "Total",
            key: "total",
            render: (record) => `$${record.total.toFixed(2)}`,
        },
        {
            title: "Paid Amount",
            key: "paidAmount",
            render: (record) => {
                return `$${record.paidAmount.toFixed(2)}`;
            },
        },
        {
            title: "Origin",
            dataIndex: "origin",
            key: "origin",
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
            </Layout.Body>
        </Layout>
    );
};

export default Search;
