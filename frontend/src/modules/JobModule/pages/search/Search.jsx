import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import { get_jobs } from "../../api/general/general";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../components/common/layout";

const Search = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            const data = await get_jobs();
            setJobs(data.payload);
            setLoading(false);
        };
        fetchJobs();
    }, []);

    const columns = [
        {
            title: "Fecha",
            dataIndex: "date",
            key: "date",
            render: (date) => moment(date).format("DD/MM/YYYY"),
        },
        {
            title: "Vehículo",
            key: "vehicle",
            render: (_, record) =>
                `${record.vehicle.brand} ${record.vehicle.model}`,
        },
        {
            title: "Patente",
            key: "license",
            render: (_, record) => `${record.vehicle.licensePlate}`,
        },
        {
            title: "Compañía",
            key: "company",
            render: (_, record) => {
                const name = record.isParticular
                    ? "Particular"
                    : record?.claims?.[0]?.company?.name;
                const color = record.isParticular ? "orange" : "blue";
                return <Tag color={color}>{name}</Tag>;
            },
        },
        {
            title: "Estado",
            dataIndex: "status",
            key: "status",
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
        <Layout>
            <Layout.Body>
                <h1>Página de Trabajos</h1>
                <Table
                    size="small"
                    bordered
                    loading={loading}
                    rowKey="_id"
                    dataSource={jobs}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                />
            </Layout.Body>
        </Layout>
    );
};

export default Search;
