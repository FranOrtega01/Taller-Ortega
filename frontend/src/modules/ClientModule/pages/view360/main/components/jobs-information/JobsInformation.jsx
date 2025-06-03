import React, { useState, useEffect } from "react";
import { get_client_associated_jobs } from "../../../../../../../services/api/general/general";
import { Table, Row, Col, Tag, Button } from "antd";
import { t } from "../../../../../../../customHooks/useTranslation";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export const JobsInformation = ({ id, client }) => {
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    const getJobs = async () => {
        try {
            setLoading(true);
            const res = await get_client_associated_jobs(id);
            console.log("Ass jobs: ", res.payload);
            setJobs(res?.payload || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getJobs();
    }, []);

    const columns = [
        {
            title: t("date-lbl"),
            key: "date",
            render: (_, record) =>
                record?.date ? moment(record?.date).format("DD/MM/YY") : "-",
        },
        {
            title: t("vehicle-lbl"),
            key: "vehicle",
            render: (_, record) =>
                `${record?.vehicle?.brand} ${record?.vehicle?.model}`,
        },
        {
            title: t("company-lbl"),
            key: "company",
            render: (_, record) => (
                <Tag>
                    {!record?.isParticular ? record?.company : "Particular"}
                </Tag>
            ),
        },
        {
            title: t("status-lbl"),
            key: "status",
            render: (_, record) => <Tag>{record?.status}</Tag>,
        },
        {
            title: "Acciones",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => navigate(`/trabajos/view/${record._id}`)}
                >
                    Ver
                </Button>
            ),
        },
    ];

    return (
        <>
            <div>jobs</div>
            <Table
                loading={loading}
                rowKey="_id"
                bordered
                size="small"
                columns={columns}
                dataSource={jobs}
                pagination={{ pageSize: 10 }}
            />
        </>
    );
};
