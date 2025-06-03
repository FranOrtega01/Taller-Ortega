import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import {
    get_jobs,
    get_job_statuses,
    get_companies,
} from "../../../../services/api/general/general";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../components/common/layout";
import {
    jobStatusColor,
    formatLicense,
    jobIsCompanyColor,
} from "../../../../services/utils";
import { Filters } from "./filters/Filters";
const Search = () => {
    const [jobs, setJobs] = useState([]);
    const [totalItems, setTotalItems] = useState();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});

    const fetchJobs = async (
        currentPage = page,
        currentPageSize = pageSize,
        currentFilters = filters
    ) => {
        try {
            setLoading(true);
            const data = await get_jobs(
                currentPage,
                currentPageSize,
                currentFilters
            );
            setJobs(data?.payload?.data || []);
            setTotalItems(data?.payload?.totalItems || 0);
        } catch (error) {
            console.log("error: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page, pageSize, filters]);

    const columns = [
        {
            title: "Fecha",
            dataIndex: "date",
            key: "date",
            render: (date) => moment(date).format("DD/MM/YYYY"),
        },
        {
            title: "Compañía",
            key: "company",
            render: (_, record) => {
                const name = record.isParticular
                    ? "Particular"
                    : record?.company;
                const color = jobIsCompanyColor(name);
                return (
                    <Tag style={styles.tag} color={color}>
                        {name}
                    </Tag>
                );
            },
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
            render: (_, record) =>
                `${formatLicense(record.vehicle.licensePlate)}`,
        },
        {
            title: "Titular",
            key: "owner",
            render: (_, record) =>
                `${record.vehicle?.owner?.name} ${record.vehicle?.owner?.lastname}`,
        },
        {
            title: "Estado",
            key: "status",
            render: (_, record) => {
                return (
                    <Tag
                        style={styles.tag}
                        color={jobStatusColor(record?.status?.code)}
                    >
                        {record?.status?.name}
                    </Tag>
                );
            },
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
                <Filters
                    setFilters={(f) => {
                        setPage(1);
                        setFilters(f);
                    }}
                    loading={loading}
                />
                <Table
                    size="small"
                    bordered
                    loading={loading}
                    rowKey="_id"
                    dataSource={jobs}
                    columns={columns}
                    pagination={{
                        total: totalItems,
                        pageSize: pageSize,
                        current: page,
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                        },
                    }}
                />
            </Layout.Body>
        </Layout>
    );
};

export default Search;

const styles = {
    tag: {
        width: "100%",
        textAlign: "center",
    },
};
