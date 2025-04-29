import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from "react";
import { AdditionalData } from "../pages/create/components/additional-data/AdditionalData";
import { CompanyData } from "../pages/create/components/company-data/CompanyData";
import { EstimateData } from "../pages/create/components/estimate-data/EstimateData";
import { VehicleData } from "../pages/create/components/vehicle-data/VehicleData";
import { JobData } from "../pages/create/components/job-data/ParticularJobData";

const JobContext = createContext();

export function useJob() {
    return useContext(JobContext);
}

export function JobProvider({ children }) {
    const [mode, setMode] = useState(null);
    const [step, setStep] = useState(2);
    const [submitting, setSubmitting] = useState(false);
    const [jobData, setJobData] = useState(null);

    const renderSelectedStep = (selectedStep) => {
        setStep(selectedStep);
    };

    const stepBack = () => {
        setStep(step - 1);
    };

    const renderStep = () => {
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

    const saveJobData = async (values) => {
        console.log("Vlues", values);
        
        const stepsLength = mode === "particular" ? 4 : 5;
        setStep((prev) => (prev < stepsLength ? prev + 1 : 0));
        if (step === 0 || step === stepsLength) {
            return;
        }
    };

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
            jobData,
            submitting,
            mode,
            step,
        }),
        [step, submitting]
    );

    return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}