import React, { useState, useEffect } from "react";
import { get_all_job_invoices } from "../../../../../../../services/api/general/general";
import { Table, Tag } from "antd";
import dayjs from "dayjs";
import { formatNumberES } from "../../../../../../../services/utils";

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
            render: (date) => dayjs(date).format("DD/MM/YY"),
        },
        // {
        //     title: "Amount",
        //     dataIndex: "amount",
        //     key: "amount",
        //     render: (amount) => `$${formatNumberES(amount)}`,
        // },
        // {
        //     title: "IVA",
        //     dataIndex: "iva",
        //     key: "iva",
        //     render: (iva) => `$${formatNumberES(iva)}`,
        // },
        {
            title: "Total",
            key: "total",
            render: (record) => `$${formatNumberES(record.amount + record.iva)}`,
        },
        {
            title: "Paid Amount",
            key: "paidAmount",
            render: (record) => {
                const paid = record.payments?.reduce(
                    (sum, p) => sum + (p.amount || 0),
                    0
                );
                return `$${formatNumberES(paid)}`;
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
