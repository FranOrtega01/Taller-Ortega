import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import { get_clients } from "../../api/general/general";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Search = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            const data = await get_clients();
            setClients(data.payload);
            setLoading(false);
        };
        fetchClients();
    }, []);

    const columns = [
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Apellido",
            key: "lastname",
            render: (_, record) => `${record.lastname || ""}`,
        },
        {
            title: "DNI",
            key: "id",
            render: (_, record) =>
                `${record.id.replace(/^(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3")}`,
        },
        {
            title: "Acciones",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => navigate(`/clientes/view/${record.id}`)}
                >
                    Ver
                </Button>
            ),
        },
    ];

    return (
        <>
            <h1>Página de Clientes</h1>
            <Table
                size="small"
                bordered
                loading={loading}
                rowKey="_id"
                dataSource={clients}
                columns={columns}
                pagination={{ pageSize: 10 }}
            />
        </>
    );
};

export default Search;
