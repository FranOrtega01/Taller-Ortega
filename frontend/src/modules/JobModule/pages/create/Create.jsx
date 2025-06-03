import React, { useState, useEffect } from "react";
import { Steps, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useJob } from "../../contexts/jobContext";
import Layout from "../../../../components/common/layout";
import { t } from "../../../../customHooks/useTranslation.js";
import { GoBack } from "../../../../components/common/go-back/GoBack.jsx";
import {
    StepFlow,
    InnerSidebarSteps,
    GoBackLink,
    Title,
} from "../../../../components/common/sidebar/styles.js";
import { ModeSelector } from "./styles.js";
import { useNavigate } from "react-router-dom";
import { JobConfirmModal } from "./components/confirm-modal/ConfirmModal.jsx";
import { create_job } from "../../../../services/api/general/general.js";

const { Step } = Steps;

const Create = () => {
    const {
        step,
        renderStep,
        renderSelectedStep,
        mode,
        setMode,
        setJobData,
        reset,
    } = useJob();
    const navigate = useNavigate();
    const [isReady, setIsReady] = useState(false);

    const handleStepClick = (index) => {
        renderSelectedStep(index);
    };

    useEffect(() => {
        const doReset = async () => {
            await reset();
            setIsReady(true);
        };
        doReset();
        return () => {
            reset();
        };
    }, []);

    const particularStepTitles = [
        { index: 1, title: t("vehicle-data-lbl") },
        { index: 2, title: t("estimate-lbl") },
        { index: 3, title: t("particular-data-lbl") },
        { index: 4, title: t("additional-data-lbl") },
    ];

    const companyStepTitles = [
        { index: 1, title: t("vehicle-data-lbl") },
        { index: 2, title: t("estimate-lbl") },
        { index: 3, title: t("particular-data-lbl") },
        { index: 4, title: t("company-data-lbl") },
        { index: 5, title: t("additional-data-lbl") },
    ];

    const stepTitles =
        mode === "company" ? companyStepTitles : particularStepTitles;

    const handleModeSelection = (selectedMode) => {
        setMode(selectedMode);
        renderSelectedStep(1);
        setJobData((prev) => ({
            ...prev,
            isParticular: selectedMode === "particular",
        }));
    };

    const handleFinalCreate = async (data) => {
        try {
            const jobData = {
                isParticular: data.isParticular,
                licensePlate: data.vehicle.licensePlate,
                company: data.isParticualar ? null : data.company.company,
                date: data.particular.date,
                entryDate: data.particular?.entryDate,
                description: data.particular?.description,
                amount: data.particular?.amount,
                iva: data.particular?.iva,
                parts: data.particular?.parts?.map((p) => ({
                    name: p?.name,
                    quantity: p?.quantity,
                    supplier: p?.supplier,
                    dateRequested: p?.dateRequested || data.particular.date,
                })),
                workPanels: {
                    bodyWork: {
                        quantity: parseFloat(
                            data.particular?.panels?.[0]?.quantity || 0
                        ),
                        amount: parseFloat(
                            data.particular?.panels?.[0]?.amount || 0
                        ),
                    },
                    paintWork: {
                        quantity: parseFloat(
                            data.particular?.panels?.[1]?.quantity || 0
                        ),
                        amount: parseFloat(
                            data.particular?.panels?.[1]?.amount || 0
                        ),
                    },
                    glassWork: {
                        quantity: parseFloat(
                            data.particular?.panels?.[2]?.quantity || 0
                        ),
                        amount: parseFloat(
                            data.particular?.panels?.[2]?.amount || 0
                        ),
                    },
                    otherWork: {
                        quantity: parseFloat(
                            data.particular?.panels?.[3]?.quantity || 0
                        ),
                        amount: parseFloat(
                            data.particular?.panels?.[3]?.amount || 0
                        ),
                    },
                },
                estimate: data.estimate.hasEstimate
                    ? {
                          creationDate: data.estimate?.date,
                          price: data.estimate?.amount,
                          status: data.estimate?.isPaid ? "PAID" : "PENDING",
                          payments: data.estimate?.isPaid
                              ? {
                                    date: data.estimate?.paymentDate,
                                    amount: parseFloat(
                                        data.estimate?.amount || 0
                                    ),
                                    method: data.estimate?.paymentMethod,
                                }
                              : undefined,
                          thumbnails: [],
                      }
                    : null,
                //Agregar
                //observations:
                //thumbnails:
            };
            console.log("CREANDO JOB", jobData);
            const res = await create_job(jobData);
            reset();
            navigate(`/trabajos/view/${res.payload.code}`);
        } catch (error) {
            console.log("Error creating job: ", error);
        }
    };

    return (
        <Layout>
            <InnerSidebarSteps>
                <Title>
                    <GoBackLink>
                        <GoBack
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(-1)}
                        />
                    </GoBackLink>
                </Title>

                <StepFlow>
                    {step === 0 ? (
                        <ModeSelector>
                            <Button
                                type="primary"
                                block
                                onClick={() =>
                                    handleModeSelection("particular")
                                }
                            >
                                {t("select-particular")}
                            </Button>
                            <Button
                                type="primary"
                                block
                                onClick={() => handleModeSelection("company")}
                                style={{ marginTop: 10 }}
                            >
                                {t("select-company")}
                            </Button>
                        </ModeSelector>
                    ) : (
                        <Steps
                            direction="vertical"
                            current={step - 1}
                            size="small"
                        >
                            {stepTitles.map((element) => (
                                <Step
                                    key={element.index}
                                    title={element.title}
                                    onClick={() =>
                                        element.index <= step ||
                                        element.index === 1
                                            ? handleStepClick(element.index)
                                            : null
                                    }
                                    disabled={
                                        element.index <= step ||
                                        element.index === 1
                                            ? false
                                            : true
                                    }
                                />
                            ))}
                        </Steps>
                    )}
                </StepFlow>
            </InnerSidebarSteps>

            <Layout.Body>
                <>{isReady && renderStep()}</>
                <JobConfirmModal onCreate={handleFinalCreate} />
            </Layout.Body>
        </Layout>
    );
};

export default Create;
