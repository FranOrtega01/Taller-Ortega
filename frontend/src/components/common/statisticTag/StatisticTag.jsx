import React from "react";
import { Tag } from "antd";

export const StatisticTag = ({ title, value, color }) => (
    // <div style={{ display: "flex", flexDirection: "column" }}>
    <div className="ant-statistic">
        <div style={{ paddingTop: 2.5, color: "#8c8c8c", fontSize: "14px", marginBottom: 16 }}>
            {title}
        </div>
        <Tag style={{width: "100%", textAlign: "center", padding: 2 }} color={color}>
            {value ?? "-"}
        </Tag>
    </div>
);
