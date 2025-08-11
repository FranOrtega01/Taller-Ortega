import React, { useState, useEffect } from "react";
import { get_all_job_invoices } from "../../../../../../../services/api/general/general";
import { Table, Tag, Flex, Button, Modal } from "antd";
import dayjs from "dayjs";
import {
    formatNumberES,
    getParticularInvoiceDescription,
    formatLicense
} from "../../../../../../../services/utils";
import Layout from "../../../../../../../components/common/layout";
import { t } from "../../../../../../../customHooks/useTranslation";
import { InvoiceForm } from "../../../../../../../components/invoice-form/InvoiceForm";
import {
    NOTIFICATION_TYPE,
    showNotification,
} from "../../../../../../../components/common/notification/Notification";
import { create_invoice } from "../../../../../../../services/api/general/general";

export const Invoices = ({ id, data }) => {
    const [invoices, setInvoices] = useState([]);
    const [modalData, setModalData] = useState(null);

    const INVOICE_TYPES = [{ code: "X", name: "Trabajo Particular" }];

    const fetchInvoices = async () => {
        const invoices = await get_all_job_invoices(id);
        setInvoices(invoices.payload);
    };

    const handleModalData = () => {
        const vehicle = `${data.vehicle.brand} ${data.vehicle.model}`;
        const owner = `${data?.vehicle?.owner?.name} ${data?.vehicle?.owner?.lastname}`;

        setModalData({
            total: data?.expenses?.amount,
            cuit: "00000000000",
            description: getParticularInvoiceDescription(
                owner,
                vehicle,
                formatLicense(data.vehicle.licensePlate)
            ),
            jobId: data._id,
        });
    };

    const handleAttachInvoice = async (values) => {
        try {
            const payload = {
                code: values.code,
                posNumber: values.posNumber,
                number: values.number,
                issueDate: dayjs(values.date).format("YYYY-MM-DD"),
                amount: values.total,
                iva: values.iva,
                // caeNumber: values?.caeNumber ? values.caeNumber : null,
                // caeDate: values?.caeDate
                //     ? dayjs(values.caeDate).format("YYYY-MM-DD")
                //     : null,
                caeNumber: 0,
                caeDate: dayjs(values.date).format("YYYY-MM-DD"),
                cuit: values.cuit,
                description: values.description,
                jobId: values.jobId,
            };
            const res = await create_invoice(payload);
            setModalData(null);
            showNotification(
                NOTIFICATION_TYPE.SUCCESS,
                t("create-invoice-success-lbl")
            );
        } catch (error) {
            showNotification(
                NOTIFICATION_TYPE.ERROR,
                t("create-invoice-error-lbl")
            );
        }
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
            render: (record) =>
                `$${formatNumberES(record.amount + record.iva)}`,
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
        <>
            <Flex justify={"space-between"} align={"center"}>
                <Layout.SubTitle>{t("invoice-title")}</Layout.SubTitle>
                <Button disabled={data?.status?.code === "PENDING"} type="primary" ghost onClick={handleModalData}>
                    {t("upload-invoice-lbl")}
                </Button>
            </Flex>

            <Table
                dataSource={invoices}
                columns={columns}
                rowKey="_id"
                size="small"
                pagination={{ pageSize: 5 }}
            />
            <Modal
                open={modalData}
                width={"50%"}
                onCancel={() => setModalData(null)}
                title={`Cargar comprobante a trabajo`}
                footer={null}
            >
                <InvoiceForm
                    finishAction={handleAttachInvoice}
                    data={modalData}
                    type={"JOB"}
                    invoiceTypes={INVOICE_TYPES}
                    isCreditNote={false}
                />
            </Modal>
        </>
    );
};
