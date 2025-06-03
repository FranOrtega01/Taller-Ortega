import React, { useEffect, useState } from "react";
import { Parts } from "./components/parts/Parts";
import { Description } from "./components/description/Description";

export const GeneralInformation = ({ id, data, refreshData }) => {
    return (
        <div>
            <Description description={data?.description} />

            {data?.parts && (
                <Parts
                    refreshData={refreshData}
                    parts={data?.parts}
                    jobId={id}
                />
            )}
        </div>
    );
};
