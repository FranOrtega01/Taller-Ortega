import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import { get_suppliers } from "../../../../services/api/general/general";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../components/common/layout";
import {
    jobStatusColor,
    formatLicense,
    jobIsCompanyColor,
    formatCUIT,
} from "../../../../services/utils";
// import { Filters } from "./filters/Filters";
import { t } from "../../../../customHooks/useTranslation";
const Search = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [totalItems, setTotalItems] = useState();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});

    const fetchSuppliers = async (
        currentPage = page,
        currentPageSize = pageSize,
        currentFilters = filters
    ) => {
        try {
            setLoading(true);
            const data = await get_suppliers();
            // currentPage,
            // currentPageSize,
            // currentFilters
            const payload = [...data?.payload].map((el) => ({
                id: el._id,
                name: el?.name ?? "",
                cuit: el?.cuit ?? "",
                email: el?.emails?.[0] ?? "",
            }));
            setSuppliers(payload);
            // setTotalItems(data?.payload?.totalItems || 0);
        } catch (error) {
            console.log("error: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, [page, pageSize, filters]);

    const columns = [
        {
            title: t("name-lbl"),
            key: "name",
            dataIndex: "name",
        },
        {
            title: t("cuit-lbl"),
            key: "cuit",
            dataIndex: "cuit",
            render: (text) => formatCUIT(text),
        },
        {
            title: t("email-lbl"),
            key: "email",
            dataIndex: "email",
        },
        {
            title: "Acciones",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => navigate(`/proveedores/view/${record.id}`)}
                >
                    Ver
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            <Layout.Body>
                <h1>Página de Proveedores</h1>
                {/* <Filters
                    setFilters={(f) => {
                        setPage(1);
                        setFilters(f);
                    }}
                    loading={loading}
                /> */}
                <Table
                    size="small"
                    bordered
                    loading={loading}
                    rowKey="_id"
                    dataSource={suppliers}
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
