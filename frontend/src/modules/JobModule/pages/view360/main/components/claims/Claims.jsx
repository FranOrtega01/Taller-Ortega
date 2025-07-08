import React, { useState, useEffect } from "react";
import {
    Statistic,
    Tag,
    Button,
    Table,
    Tabs,
    Space,
    Row,
    Flex,
    Modal,
} from "antd";
import { t } from "../../../../../../../customHooks/useTranslation";
import moment from "moment";
import {
    formatNumberES,
    formatLicense,
    getClaimInvoiceDescription,
} from "../../../../../../../services/utils";
import { ClaimDetail } from "./components/claim-detail/ClaimDetail";
import { InvoiceForm } from "../../../../../../../components/invoice-form/InvoiceForm";
import dayjs from "dayjs";
import {
    NOTIFICATION_TYPE,
    showNotification,
} from "../../../../../../../components/common/notification/Notification";
import {
    create_invoice,
    get_job_claims,
} from "../../../../../../../services/api/general/general";

const STATISTIC_STYLE = {
    fontSize: 14,
};

export const Claims = ({ id, data }) => {
    const [activeTab, setActiveTab] = useState("summary");
    const [modalData, setModalData] = useState(null);
    const [tempClaims, setTempClaims] = useState([]);
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(false);

    const INVOICE_TYPES = [
        { code: "A", name: "Factura A" },
        { code: "FCE", name: "Factura de Crédito Electrónica (FCE) A" },
    ];

    const [totalAmount, setTotalAmount] = useState(0);

    const fetchJobClaims = async () => {
        try {
            const response = await get_job_claims(id);
            const claimsData = response.payload || [];
            [...(claimsData || [])].sort((a, b) =>
                moment(a.date).diff(moment(b.date))
            );
            setClaims(claimsData);
            const total = claimsData?.reduce(
                (acc, c) => acc + (c.amount || 0),
                0
            );
            setTotalAmount(total);
        } catch (error) {
            console.error("Error fetching job claims:", error);
            showNotification(
                NOTIFICATION_TYPE.ERROR,
                t("fetch-job-claims-error-lbl")
            );
        }
    };

    const handleAddAmpTab = () => {
        if (tempClaims?.length) return;

        const mainClaim = claims.find((c) => c.type === "MAIN");
        console.log();

        if (!mainClaim) {
            showNotification(
                NOTIFICATION_TYPE.ERROR,
                "No se encontró un siniestro MAIN"
            );
            return;
        }

        const newAmp = {
            _id: "temp-amp", // identificador temporal
            type: "AMP",
            date: new Date().toISOString(),
            deductible: 0,
            amount: null,
            insured: mainClaim.insured,
            number: mainClaim.number,
            status: { code: "TEMP", name: t("new-amp-lbl") },
            company: mainClaim.company,
            vehicle: data.vehicle,
            isNew: true,
            isCleas: false,
            root: mainClaim._id,
        };

        setTempClaims([newAmp]);
        setActiveTab("temp-amp");
    };

    const handleRemoveTempClaimTab = (key) => {
        if (key === "temp-amp") {
            setTempClaims([]);
            setActiveTab("summary");
        }
    };

    const handleOnCreateAmp = async (currentTab = "summary") => {
        try {
            await fetchJobClaims();
            setTempClaims([]);
            setActiveTab(currentTab);
        } catch (error) {
            showNotification(
                NOTIFICATION_TYPE.ERROR,
                t("fetch-job-claims-error-lbl")
            );
        }
    };

    const getClaimLbl = (claimType) => {
        return t(`claim-${claimType.toLowerCase()}-lbl`);
    };

    const getClaimActionLbl = (claimStatus) => {
        switch (claimStatus) {
            case "TEMP":
                return t("create-lbl");
            case "PENDING":
                return t("activate-lbl");
            case "ACTIVE":
                return t("complete-lbl");
        }
    };

    const handleModalData = (record) => {
        const vehicle = `${data.vehicle.brand} ${data.vehicle.model}`;
        console.log("record: ", record);

        setModalData({
            total: record.amount,
            cuit: record.company.cuit,
            description: getClaimInvoiceDescription(
                record.number,
                record.insured,
                vehicle,
                formatLicense(data.vehicle.licensePlate)
            ),
            number: record.number,
            claimId: record._id,
        });
    };

    const handleAttachInvoice = async (values) => {
        try {
            console.log("values: ", values);
            const payload = {
                code: values.code,
                posNumber: values.posNumber,
                number: values.number,
                issueDate: dayjs(values.date).format("YYYY-MM-DD"),
                amount: values.amount,
                iva: values.iva,
                caeNumber: values?.caeNumber ? values.caeNumber : null,
                caeDate: values?.caeDate
                    ? dayjs(values.caeDate).format("YYYY-MM-DD")
                    : null,
                cuit: values.cuit,
                description: values.description,
                claimId: values.claimId,
            };

            console.log("payload: ", payload);
            console.log("vluaes: ", values);

            
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
        fetchJobClaims();
    }, [id]);

    const columns = [
        {
            title: t("claim-type-lbl"),
            dataIndex: "type",
            key: "type",
            render: (text) => getClaimLbl(text),
        },
        {
            title: t("claim-date-lbl"),
            dataIndex: "date",
            key: "date",
            render: (date) => moment(date).format("DD/MM/YY"),
        },
        {
            title: t("claim-amount-lbl"),
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `$${formatNumberES(amount, 2) || "-"}`,
        },
        {
            title: t("claim-deductible-lbl"),
            dataIndex: "deductible",
            key: "deductible",
            render: (deductible) => `$${formatNumberES(deductible, 2) || "-"}`,
        },
        {
            title: t("claim-status-lbl"),
            dataIndex: ["status", "name"],
            key: "status",
            render: (status) => (
                <Tag
                    style={{ width: "100%", textAlign: "center" }}
                    color="gold"
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: t("actions-lbl"),
            key: "actions",
            render: (_, record) => (
                <Flex vertical align="start">
                    <Button
                        onClick={() => setActiveTab(record._id)}
                        size="small"
                        type="link"
                    >
                        {t("view-details-lbl")}
                    </Button>
                    <Button
                        // disabled={record?.associatedInvoices.length}
                        onClick={() => handleModalData(record)}
                        size="small"
                        type="link"
                    >
                        {t("attach-invoice-lbl")}
                    </Button>
                </Flex>
            ),
        },
    ];

    return (
        <>
            {loading ? (
                <Spin />
            ) : (
                <Tabs
                    defaultActiveKey="summary"
                    activeKey={activeTab}
                    type="editable-card"
                    hideAdd={
                        tempClaims?.length > 0 ||
                        data?.companyData?.claims?.claims?.[0]?.status?.code ===
                            "PENDING"
                    } // Ocultar "+" si ya hay uno
                    onEdit={(targetKey, action) => {
                        if (action === "add") handleAddAmpTab();
                        if (action === "remove")
                            handleRemoveTempClaimTab(targetKey);
                    }}
                    onChange={setActiveTab}
                    tabPosition="top"
                    style={{ marginBottom: "2rem" }}
                >
                    <Tabs.TabPane
                        closable={false}
                        tab={t("claim-summary-tab")}
                        key="summary"
                    >
                        <Row style={{ gap: "5rem" }}>
                            <Statistic
                                title={t("claim-number-lbl")}
                                valueStyle={STATISTIC_STYLE}
                                value={claims?.[0]?.number || "-"}
                            />
                            <Statistic
                                title={t("claim-sum-lbl")}
                                valueStyle={STATISTIC_STYLE}
                                value={`$${formatNumberES(totalAmount)}`}
                            />
                            <Statistic
                                title={t("claim-insured-lbl")}
                                valueStyle={STATISTIC_STYLE}
                                value={claims?.[0]?.insured || "-"}
                            />
                        </Row>
                        <Table
                            columns={columns}
                            dataSource={claims}
                            rowKey="_id"
                            pagination={false}
                            size="small"
                            style={{ marginTop: "1rem" }}
                        />
                        <Modal
                            open={modalData}
                            width={"50%"}
                            onCancel={() => setModalData(null)}
                            title={`Cargar comprobante a siniestro ${modalData?.number}`}
                            footer={null}
                        >
                            <InvoiceForm
                                finishAction={handleAttachInvoice}
                                data={modalData}
                                type={"CLAIM"}
                                invoiceTypes={INVOICE_TYPES}
                                isCreditNote={false}
                            />
                        </Modal>
                    </Tabs.TabPane>

                    {[...claims, ...tempClaims].map((claim) => {
                        return (
                            <Tabs.TabPane
                                key={claim._id}
                                closable={claim?.isNew === true}
                                tab={`${t(
                                    claim?.type?.toLowerCase() + "-lbl"
                                )} ${moment(claim?.date).format("DD/MM")}`}
                            >
                                <ClaimDetail
                                    getClaimActionLbl={getClaimActionLbl}
                                    getClaimLbl={getClaimLbl}
                                    claim={claim}
                                    setTempClaims={setTempClaims}
                                    fetchJobClaims={fetchJobClaims}
                                    loading={loading}
                                    setLoading={setLoading}
                                    handleOnCreateAmp={handleOnCreateAmp}
                                />
                            </Tabs.TabPane>
                        );
                    })}
                </Tabs>
            )}
        </>
    );
};
