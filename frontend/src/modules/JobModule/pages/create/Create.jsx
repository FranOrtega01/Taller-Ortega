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

const { Step } = Steps;

const Create = () => {
    const { step, renderStep, renderSelectedStep, mode, setMode } = useJob();
    const navigate = useNavigate();

    const handleStepClick = (index) => {
        renderSelectedStep(index);
    };

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
                <>{renderStep()}</>
            </Layout.Body>
        </Layout>
    );
};

export default Create;
