import React from "react";
import { useJob } from "../../../../contexts/jobContext";
import { Button } from "antd";

export const CompanyData = () => {
    const { step, stepBack, renderSelectedStep } = useJob();

    return (
        <>
            <div>CompanyData</div>
            <Button onClick={stepBack}>
                Siguiente
            </Button>
            <Button onClick={() => renderSelectedStep(step + 1)}>
                Siguiente
            </Button>
        </>
    );
};
