import React, { useEffect, useState } from "react";
import { Parts } from "./components/parts/Parts";
import { Description } from "./components/description/Description";
import { WorkPanels } from "./components/work-panels/WorkPanels";

import { Spin } from "antd";

export const GeneralInformation = ({ id, data, refreshData, canEdit }) => {
    if (!data) return <Spin />;
    return (
        <div>
            <Description description={data?.description} />

            {/* {data?.parts && (
                <Parts
                    refreshData={refreshData}
                    parts={data?.parts}
                    jobId={id}
                />
            )} */}
            <WorkPanels canEdit={canEdit} jobId={id} workPanels={data?.workPanels} />
        </div>
    );
};
