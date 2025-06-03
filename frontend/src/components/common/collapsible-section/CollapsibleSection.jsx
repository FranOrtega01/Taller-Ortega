import React from "react";
import { Collapse } from "antd";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import { t } from "../../../customHooks/useTranslation";
const { Panel } = Collapse;
import Layout from "../layout";

export const CollapsibleSection = ({
    header,
    children,
    defaultOpen = true,
    icon = true,
}) => {
    return (
        <Collapse
            defaultActiveKey={defaultOpen ? ["1"] : []}
            expandIconPosition="start"
            expandIcon={({ isActive }) =>
                icon ? (
                    <CaretRightOutlined
                        style={{
                            transform: isActive
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                        }}
                    />
                ) : null
            }
            ghost
            size="small"
            items={[
                {
                    key: "1",
                    label: t(header),
                    children: children,
                },
            ]}
        />
    );
};
