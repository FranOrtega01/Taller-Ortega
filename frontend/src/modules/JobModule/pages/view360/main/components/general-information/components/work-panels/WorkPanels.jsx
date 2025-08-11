import React, { useEffect, useState } from "react";
import { CollapsibleSection } from "../../../../../../../../../components/common/collapsible-section/CollapsibleSection";
import {
    Table,
    Tag,
    Select,
    Form,
    Flex,
    Row,
    Col,
    Button,
    Space,
    Input,
    InputNumber,
    message,
    Badge,
} from "antd";
import {
    toKebabLabel,
    formatNumberES,
} from "../../../../../../../../../services/utils";
import FloatingLabel from "../../../../../../../../../components/common/floatingLabel/FloatingLabel";
import { t } from "../../../../../../../../../customHooks/useTranslation";
import { CustomInputNumber } from "../../../../../../../../../components/common/theme/inputs/custom-input-number/CustomInputNumber";

const workPanelItems = ["bodyWork", "paintWork", "glassWork", "otherWork"];

export const WorkPanels = ({ workPanels, canEdit, form }) => {
    console.log("work panels: ", workPanels);

    return (
        <Flex vertical gap={"middle"}>
            {workPanelItems?.map((wp) => {
                // Usar useWatch para observar los valores actuales del form
                const panelValues = Form.useWatch(["workPanels", wp], form) || {};
                const quantity = panelValues.quantity ?? workPanels?.[wp]?.quantity ?? 0;
                const amount = panelValues.amount ?? workPanels?.[wp]?.amount ?? 0;
                return (
                    <Row gutter={[16, 16]} align={"middle"} key={wp}>
                        <Col span={4}>
                            <span>{toKebabLabel(wp)}</span>
                        </Col>
                        <Col span={6}>
                            <Space.Compact>
                                <Form.Item
                                    name={["workPanels", wp, "quantity"]}
                                    noStyle
                                    initialValue={workPanels?.[wp]?.quantity || 0}
                                >
                                    <CustomInputNumber
                                        readOnly={!canEdit}
                                        addonBefore="#"
                                        style={{ width: "30%" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name={["workPanels", wp, "amount"]}
                                    noStyle
                                    initialValue={workPanels?.[wp]?.amount || 0}
                                >
                                    <CustomInputNumber
                                        readOnly={!canEdit}
                                        addonBefore="$"
                                        style={{ width: "70%" }}
                                    />
                                </Form.Item>
                            </Space.Compact>
                        </Col>
                        <Col>
                            <span>
                                $
                                {formatNumberES(
                                    (Number(amount) || 0) * (Number(quantity) || 0)
                                )}
                            </span>
                        </Col>
                    </Row>
                );
            })}
        </Flex>
    );
};