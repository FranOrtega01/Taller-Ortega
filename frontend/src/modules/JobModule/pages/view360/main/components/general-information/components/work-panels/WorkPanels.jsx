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
const workPanelItems = ["bodyWork", "paintWork", "glassWork", "otherWork"];

export const WorkPanels = ({ workPanels, canEdit }) => {
    const [form] = Form.useForm();

    return (
        <Form form={form} layout="vertical">
            <Flex vertical gap={"middle"}>
                {workPanelItems?.map((wp) => (
                    <Row gutter={[16, 16]} align={"middle"} key={wp}>
                        <Col span={4}>
                            <span>{toKebabLabel(wp)}</span>
                        </Col>
                        <Col span={6}>
                            <Space.Compact>
                                <Form.Item
                                    name={[wp, "quantity"]}
                                    noStyle
                                    initialValue={
                                        workPanels?.[wp]?.quantity || 0
                                    }
                                >
                                    <InputNumber
                                        // disabled={!canEdit}
                                        readOnly={!canEdit}
                                        addonBefore="#"
                                        style={{ width: "30%" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name={[wp, "amount"]}
                                    noStyle
                                    initialValue={workPanels?.[wp]?.amount || 0}
                                >
                                    <InputNumber
                                        // disabled={!canEdit}
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
                                    workPanels?.[wp]?.amount *
                                        workPanels?.[wp]?.quantity
                                )}
                            </span>
                        </Col>
                    </Row>
                ))}
            </Flex>
        </Form>
    );
};
