import React, { useState, useEffect } from "react";
import Layout from "../../../../components/common/layout";
import { get_invoice_stats } from "../../../../services/api/general/general";
import Chart from "react-apexcharts";
import { DatePicker, Space, Select } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

export const GeneralStats = () => {
    const [stats, setStats] = useState(null);
    const [filterType, setFilterType] = useState("month"); // 'month' o 'year'
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const getGeneralStats = async (date) => {
        let dateFrom, dateTo;

        if (filterType === "month") {
            dateFrom = date.startOf("month").format("YYYY-MM-DD");
            dateTo = date.endOf("month").format("YYYY-MM-DD");
        } else {
            dateFrom = date.startOf("year").format("YYYY-MM-DD");
            dateTo = date.endOf("year").format("YYYY-MM-DD");
        }

        try {
            const data = await get_invoice_stats({ dateFrom, dateTo });
            console.log("General Stats: ", data);
            setStats(data.payload);
        } catch (error) {
            console.error("Error fetching general stats: ", error);
        }
    };

    useEffect(() => {
        getGeneralStats(selectedDate);
    }, [selectedDate, filterType]);

    if (!stats) return null;

    const companyLabels = [
        ...stats.byCompany.map((item) => item._id)
    ];
    const companyValues = [
        ...stats.byCompany.map((item) => item.count)
    ];

    const statusLabels = stats.byStatus.map((item) => item._id);
    const statusValues = stats.byStatus.map((item) => item.count);

    const chartOptions = {
        chart: { type: "pie" },
        legend: { position: "bottom" },
        labels: [],
        dataLabels: { enabled: true },
        tooltip: {
            y: {
                formatter: (val) => `${val} facturas`,
            },
        },
    };

    return (
        <Layout>
            <Layout.Body>
                <h1>Estadísticas</h1>

                <div style={{ marginBottom: 20 }}>
                    <Space>
                        <span>Filtrar por:</span>
                        <Select
                            value={filterType}
                            onChange={setFilterType}
                            style={{ width: 120 }}
                        >
                            <Option value="month">Mes</Option>
                            <Option value="year">Año</Option>
                        </Select>
                        <DatePicker
                            picker={filterType}
                            allowClear={false}
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date || dayjs())}
                        />
                    </Space>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
                    <div style={{ width: 400 }}>
                        <h3>Por Compañía</h3>
                        <Chart
                            options={{ ...chartOptions, labels: companyLabels }}
                            series={companyValues}
                            type="pie"
                            width="100%"
                        />
                    </div>

                    <div style={{ width: 400 }}>
                        <h3>Por Estado</h3>
                        <Chart
                            options={{ ...chartOptions, labels: statusLabels }}
                            series={statusValues}
                            type="pie"
                            width="100%"
                        />
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    );
};
