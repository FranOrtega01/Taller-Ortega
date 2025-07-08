import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Main } from "./styles";
import Layout from "../../../../components/common/layout";
import Sidebar from "./sidebar/Sidebar";
import { GeneralInformation } from "./main/components/general-information/GeneralInformation";
import { Files } from "./main/components/files/Files";
import { Claims } from "./main/components/claims/Claims";
import { Client } from "./main/components/client/Client";
import { Invoices } from "./main/components/invoices/Invoices";
import { Vehicle } from "./main/components/vehicle/Vehicle";
import {
    get_job_by_id,
    complete_job,
    activate_job,
} from "../../../../services/api/general/general";
import Header from "./header/Header";
import SkeletonSidebar from "../../../../components/common/sidebar/skeleton-sidebar/SkeletonSidebar";
import { Estimate } from "./main/components/estimate/Estimate";
import { t } from "../../../../customHooks/useTranslation";
import {
    showNotification,
    NOTIFICATION_TYPE,
} from "../../../../components/common/notification/Notification";
const View = () => {
    const { id } = useParams();
    const [activeKey, setActiveKey] = useState("GeneralInfo");
    const [loading, setLoading] = useState(false);
    const [job, setJob] = useState(null);
    const [sidebarLoaded, setSidebarLoaded] = useState(false);
    const [canEdit, setCanEdit] = useState(null);

    const getJob = async () => {
        try {
            if (!sidebarLoaded) setLoading(true);
            setLoading(true);
            const job = await get_job_by_id(id);
            setSidebarLoaded(true);
            // Can Edit -> if job is pending (not activated) can edit = true
            setCanEdit(
                job?.payload?.status?.code === "PENDING" ||
                    job?.payload?.status?.code === "IN_PROGRESS"
            );
            setJob(job?.payload || {});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getJob();
    }, []);

    const getBtnLabel = () => {
        switch (job?.status?.code) {
            case "PENDING":
                return t("activate-lbl");
            case "IN_PROGRESS":
                return t("complete-lbl");
            default:
                return t("default-lbl");
        }
    };

    const getStatusLabel = () => {
        let paid = true;
        job?.associatedInvoices?.forEach((inv) => {
            if (!inv?.payments?.length) {
                paid = false;
            }
        });
        if (job?.status?.code === "COMPLETED") {
            return `${job?.status?.name} | ${
                paid ? "Cobrado" : "Pendiente de cobro"
            }`;
        }

        return job?.status?.name;
    };

    const activate = async () => {
        console.log("Activate btn");
    };

    const complete = async () => {
        console.log("Complete btn");
        try {
            await complete_job(id);
            showNotification(
                NOTIFICATION_TYPE.SUCCESS,
                t("complete-job-success-lbl")
            );
        } catch (error) {
            showNotification(
                NOTIFICATION_TYPE.ERROR,
                t("complete-job-error-lbl"),
                error?.response?.data?.message
            );
        }
    };

    const btnAction = async () => {
        try {
            if (job?.status?.code === "PENDING") {
                await activate();
            }
            if (job?.status?.code === "IN_PROGRESS") {
                await complete();
            }
            getJob();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            {!sidebarLoaded ? (
                <SkeletonSidebar style={{ paddingTop: "7rem" }} lines={5} />
            ) : (
                <Sidebar
                    isParticular={job?.isParticular}
                    activeKey={activeKey}
                    setActiveKey={setActiveKey}
                />
            )}
            <Layout.Body>
                <Header
                    btnAction={btnAction}
                    getStatusLabel={getStatusLabel}
                    getBtnLabel={getBtnLabel}
                    data={job}
                />
                <Main>
                    {activeKey === "GeneralInfo" && (
                        <GeneralInformation
                            canEdit={canEdit}
                            refreshData={getJob}
                            id={id}
                            data={job}
                        />
                    )}

                    {activeKey === "Estimate" && (
                        <Estimate id={id} data={job} />
                    )}

                    {activeKey === "Files" && <Files id={id} data={job} />}

                    {activeKey === "Claims" && <Claims id={id} data={job} />}

                    {activeKey === "Client" && <Client id={id} data={job} />}

                    {activeKey === "Invoices" && (
                        <Invoices id={id} data={job} />
                    )}
                    {activeKey === "Vehicle" && <Vehicle id={id} data={job} />}
                </Main>
            </Layout.Body>
        </Layout>
    );
};

export default View;
