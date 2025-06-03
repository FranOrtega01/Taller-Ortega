import React, { useState, useEffect, useRef, useContext } from "react";
import { Table, Tag, Select, Form, Button, message, Badge } from "antd";
import { t } from "../../../../../../../../../customHooks/useTranslation";
import moment from "moment";
import { partStatusColor } from "../../../../../../../../../services/utils";
import { CollapsibleSection } from "../../../../../../../../../components/common/collapsible-section/CollapsibleSection";
import {
    get_part_statuses,
    update_part_status,
} from "../../../../../../../../../services/api/general/general";
import { Dot } from "../../../../../../../../../components/common/dot/Dot";

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    statusOptions,
    updateOnChange,
    jobId,
    parts,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record.status?.code });
    };

    const save = async (value) => {
        try {
            const updated = {
                ...record,
                status: {
                    code: value,
                    name: statusOptions.find((s) => s.code === value)?.name,
                },
            };
            handleSave(updated);
            toggleEdit();

            if (updateOnChange) {
                await update_part_status(jobId, parts);
                message.success(t("status-updated-successfully"));
            }
        } catch (err) {
            console.error("Error updating part status:", err);
            message.error(t("status-update-failed"));
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[{ required: true, message: `${title} is required.` }]}
            >
                <Select
                    ref={inputRef}
                    onBlur={() => setEditing(false)}
                    onChange={save}
                    options={statusOptions?.map((s) => ({
                        label: s.name,
                        value: s.code,
                    }))}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingInlineEnd: 24 }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

export const Parts = ({ parts, jobId, refreshData }) => {
    const [data, setData] = useState(parts);
    const [statusOptions, setStatusOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const updateOnChange = false;

    useEffect(() => {
        const fetchStatuses = async () => {
            const res = await get_part_statuses();
            setStatusOptions(res?.payload || []);
        };
        fetchStatuses();
    }, []);

    const handleSave = (updatedRow) => {
        const newData = [...data];
        const index = newData.findIndex(
            (item) => item.name === updatedRow.name
        );
        newData.splice(index, 1, updatedRow);
        setData(newData);
    };

    const handleManualUpdate = async () => {
        try {
            setLoading(true);
            await update_part_status(jobId, {
                parts: data?.map((data) => ({
                    ...data,
                    status: data.status.code,
                })),
            });
            message.success(t("status-updated-successfully"));
            refreshData();
        } catch (err) {
            console.error(err);
            message.error(t("status-update-failed"));
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: t("part-name-lbl"),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t("part-quantity-lbl"),
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: t("part-date-req-lbl"),
            key: "requestedDate",
            render: (_, record) =>
                record?.requestedDate
                    ? moment(record?.requestedDate).format("DD/MM/YY")
                    : "-",
        },
        {
            title: t("part-status-lbl"),
            dataIndex: "status",
            key: "status",
            editable: true,
            render: (_, record) => (
                <Tag color={partStatusColor(record?.status?.code)}>
                    {record.status?.name}
                </Tag>
            ),
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: "status",
                title: col.title,
                handleSave,
                statusOptions,
                updateOnChange,
                jobId,
                parts: data,
            }),
        };
    });

    return (
        <CollapsibleSection
            header={
                <>
                    {t("parts-section-title")}
                    <Dot size={10} status={"PENDING"} style={{ marginLeft: ".5rem" }} />
                </>
            }
        >
            <Table
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }}
                rowKey={(record) => `${record?.name}-${record?.supplier}`}
                columns={mergedColumns}
                dataSource={data}
                size="small"
                pagination={false}
                rowClassName={() => "editable-row"}
            />
            {!updateOnChange && (
                <Button
                    type="primary"
                    onClick={handleManualUpdate}
                    loading={loading}
                    style={{ marginTop: "1rem" }}
                >
                    {t("update-status-btn")}
                </Button>
            )}
        </CollapsibleSection>
    );
};
