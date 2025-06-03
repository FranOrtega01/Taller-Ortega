import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import { get_vehicles } from "../../../../services/api/general/general";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Search = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);
            const data = await get_vehicles();
            console.log(data.payload);

            setVehicles(data.payload);
            setLoading(false);
        };
        fetchVehicles();
    }, []);

    const columns = [
        {
            title: "Vehiculo",
            key: "vehicle",
            render: (_, record) => `${record?.brand} ${record?.model}`,
        },
        {
            title: "Anio",
            key: "year",
            dataIndex: "year",

        },
        {
            title: "Color",
            key: "color",
            dataIndex: "color",
        },
        {
            title: "Owner",
            key: "owner",
            dataIndex: "owner"
        },
        {
            title: "Acciones",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => navigate(`/vehiculos/view/${record.licensePlate}`)}
                >
                    Ver
                </Button>
            ),
        },
    ];

    return (
        <>
            <h1>Página de Vehiculos</h1>
            <Table
                size="small"
                bordered
                loading={loading}
                rowKey="_id"
                dataSource={vehicles}
                columns={columns}
                pagination={{ pageSize: 10 }}
            />
        </>
    );
};

export default Search;
