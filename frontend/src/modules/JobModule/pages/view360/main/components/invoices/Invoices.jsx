import React, { useState, useEffect } from "react";
import { get_all_job_invoices } from "../../../../../../../services/api/general/general";
import { Table, Tag } from "antd";
import moment from "moment"

export const Invoices = ({ id, data }) => {
    const [invoices, setInvoices] = useState([]);

    const fetchInvoices = async () => {
        const invoices = await get_all_job_invoices(id);
        setInvoices(invoices.payload);
    };

    useEffect(() => {
        fetchInvoices();
    }, []);
    
    const columns = [
        {
            title: "Status",
            dataIndex: ["status", "name"],
            key: "status",
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: "Code",
            dataIndex: ["code", "name"],
            key: "code",
        },
        {
            title: "Number",
            dataIndex: ["number"],
            key: "number",
        },
        {
            title: "Date",
            dataIndex: "issueDate",
            key: "issueDate",
            render: (date) => moment(date).format("DD/MM/YY"),
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
            render: (record) => `$${(record.amount + record.iva).toFixed(2)}`,
        },
        {
            title: "Paid Amount",
            key: "paidAmount",
            render: (record) => {
                const paid = record.payments?.reduce(
                    (sum, p) => sum + (p.amount || 0),
                    0
                );
                return `$${paid.toFixed(2)}`;
            },
        },
        {
            title: "Origin",
            dataIndex: "origin",
            key: "origin",
        },
    ];

    return (
        <Table
            dataSource={invoices}
            columns={columns}
            rowKey="_id"
            size="small"
            pagination={{ pageSize: 5 }}
        />
    );
};
