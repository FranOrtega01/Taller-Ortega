import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from "react";
import { Row, Button } from "antd";
import { AdditionalData } from "../pages/create/components/additional-data/AdditionalData";
import { CompanyData } from "../pages/create/components/company-data/CompanyData";
import { EstimateData } from "../pages/create/components/estimate-data/EstimateData";
import { VehicleData } from "../pages/create/components/vehicle-data/VehicleData";
import { JobData } from "../pages/create/components/job-data/ParticularJobData";
import { t } from "../../../customHooks/useTranslation";
import { ContextFooter } from "./styles";
const JobContext = createContext();

export function useJob() {
    return useContext(JobContext);
}

export function JobProvider({ children }) {
    const [mode, setMode] = useState(null);
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [jobData, setJobData] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const renderSelectedStep = (selectedStep) => {
        if (step === 0) {
            setJobData(null);
        }
        setStep(selectedStep);
    };

    const stepBack = () => {
        setStep(step - 1);
    };

    useEffect(() => {
        console.log("payload: ", jobData);
    }, [jobData]);

    const reset = () => {
        setStep(0);
        setJobData(null), setMode(null);
    };

    const renderStep = () => {
        if (mode === "particular") {
            switch (step) {
                case 1:
                    return <VehicleData />;
                case 2:
                    return <EstimateData />;
                case 3:
                    return <JobData />;
                case 4:
                    return <AdditionalData />;
                default:
                    return null;
            }
        }
        switch (step) {
            case 1:
                return <VehicleData />;
            case 2:
                return <EstimateData />;
            case 3:
                return <JobData />;
            case 4:
                return <CompanyData />;
            case 5:
                return <AdditionalData />;
            default:
                return null;
        }
    };

    const getFormInitialsFromContext = () => {
        switch (step) {
            case 1:
                return {
                    ...jobData?.vehicle,
                };
            case 2:
                return {
                    ...jobData?.estimate,
                };
            case 3:
                return {
                    ...jobData?.particular,
                    parts: jobData?.particular?.parts || [],
                    panels: jobData?.particular?.panels || [],
                };
            case 4:
                return {
                    ...jobData?.company,
                };
            case 5:
                return {
                    ...jobData?.additional,
                };
            default:
                return {};
        }
    };

    const saveJobData = async (values) => {
        let stepData;
        setSubmitting(true);
        switch (step) {
            // Step 1 - Vehicle & Owner Info
            case 1:
                stepData = {
                    vehicle: {
                        ...values,
                    },
                };
                break;

            // Step 2 - Estimate Info

            case 2:
                stepData = {
                    estimate: {
                        ...values,
                    },
                };
                break;

            // Step 3 - Particular Info

            case 3:
                stepData = {
                    particular: {
                        ...values,
                        parts: values?.parts || [],
                        panels: values?.panels || [],
                    },
                };
                break;

            // Step 4 - Company & Claims Info

            case 4:
                stepData = {
                    company: {
                        ...values,
                    },
                };
                break;

            // Additional & Thumbnails Info
            case 5:
                stepData = {
                    additional: {
                        ...values,
                    },
                };
                break;

            default:
                stepData = {};
                break;
        }

        setJobData((prev) => ({
            ...prev,
            ...stepData,
        }));
        setSubmitting(false);
        const stepsLength = mode === "particular" ? 4 : 5;
        setStep((prev) => (prev < stepsLength ? prev + 1 : prev));
    };

    const Footer = () => (
        <ContextFooter>
            <Button onClick={stepBack}>
                {t("previous-btn") || "Anterior"}
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
                {t("following-btn") || "Siguiente"}
            </Button>
        </ContextFooter>
    );

    const value = useMemo(
        () => ({
            renderStep,
            renderSelectedStep,
            setSubmitting,
            setStep,
            stepBack,
            setMode,
            saveJobData,
            setJobData,
            reset,
            getFormInitialsFromContext,
            confirmVisible,
            setConfirmVisible,
            jobData,
            submitting,
            mode,
            step,
            Footer,
        }),
        [step, submitting, confirmVisible]
    );

    return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}
