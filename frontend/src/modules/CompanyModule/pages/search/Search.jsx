import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import { get_companies } from "../../../../services/api/general/general";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { formatCUIT } from "../../../../services/utils";
const Search = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            const data = await get_companies();
            console.log(data.payload);

            setCompanies(data.payload);
            setLoading(false);
        };
        fetchCompanies();
    }, []);

    const columns = [
        {
            title: "Nombre",
            key: "name",
            dataIndex: "name",
        },
        {
            title: "CUIT",
            key: "cuit",
            render: (_, record) => formatCUIT(record?.cuit),
        },
        {
            title: "Razon Social",
            key: ["fiscalName"],
            dataIndex: ["fiscalName"],
        },
        {
            title: "Direccion Fiscal",
            key: ["fiscalAdress", "adress"],
            dataIndex: ["fiscalAdress", "adress"],
        },
        {
            title: "Acciones",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => navigate(`/companias/view/${record.cuit}`)}
                >
                    Ver
                </Button>
            ),
        },
    ];

    return (
        <>
            <h1>Página de Companias</h1>
            <Table
                size="small"
                bordered
                loading={loading}
                rowKey="_id"
                dataSource={companies}
                columns={columns}
                pagination={{ pageSize: 10 }}
            />
        </>
    );
};

export default Search;
