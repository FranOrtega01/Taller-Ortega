import React from "react";
import { useJob } from "../../../../contexts/jobContext";
import { Button } from "antd";

export const AdditionalData = () => {
    const { step, stepBack, renderSelectedStep } = useJob();

    return (
        <>
            <div>AdditionalData</div>
            <Button onClick={stepBack}>
                Siguiente
            </Button>
            <Button onClick={() => renderSelectedStep(step + 1)}>
                Siguiente
            </Button>
        </>
    );
};
