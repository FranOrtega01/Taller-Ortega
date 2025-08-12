import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, Table, Typography, Space } from "antd";
import { get_ledger_by_supplier } from "../../../../../../../services/api/general/general";
import { SubTitle } from "../../../../../../../components/common/layout/styles";
import { formatNumberES } from "../../../../../../../services/utils";
const { Text } = Typography;

export const Account = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(dayjs().year());
    const [month, setMonth] = useState(dayjs().month() + 1);

    const [rows, setRows] = useState([]);
    const [previousBalance, setPreviousBalance] = useState(0);
    const [closingBalance, setClosingBalance] = useState(0);

    const scrollRef = useRef(null);

    const fetchLedger = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await get_ledger_by_supplier(id, { year, month });
            const {
                rows = [],
                previousBalance = 0,
                closingBalance = 0,
            } = res?.payload || {};

            // Orden ascendente por fecha (más nuevos abajo)
            const sorted = [...rows].sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            // Insertar "Saldo anterior" como primer renglón
            const startOfMonth = dayjs(
                `${year}-${String(month).padStart(2, "0")}-01`
            ).toDate();
            const previousRow = {
                _synthetic: "opening",
                date: dayjs(startOfMonth)
                    .subtract(1, "millisecond")
                    .toISOString(),
                concept: "Saldo anterior",
                debit: 0,
                credit: 0,
                runningBalance: previousBalance,
            };

            setRows([previousRow, ...sorted]);
            setPreviousBalance(previousBalance);
            setClosingBalance(closingBalance);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedger();
    }, [id, year, month]);

    useEffect(() => {
        if (!scrollRef.current) return;
        const t = setTimeout(() => {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }, 60);
        return () => clearTimeout(t);
    }, [rows]);

    const onChangeMonth = (value) => {
        if (!value) return;
        setYear(value.year());
        setMonth(value.month() + 1);
    };

    const columns = useMemo(
        () => [
            {
                title: "Fecha",
                dataIndex: "date",
                key: "date",
                width: 120,
                render: (val, record) =>
                    record._synthetic === "opening" ? (
                        <Text type="secondary">—</Text>
                    ) : (
                        dayjs(val).format("DD/MM/YYYY")
                    ),
            },
            {
                title: "Concepto",
                dataIndex: "concept",
                key: "concept",
                ellipsis: true,
                render: (val, record) =>
                    record._synthetic === "opening" ? (
                        <Text type="secondary">{val}</Text>
                    ) : (
                        val
                    ),
            },
            {
                title: "Debe",
                dataIndex: "debit",
                key: "debit",
                align: "right",
                width: 120,
                render: (val) => (val ? `$ ${formatNumberES(val)}` : "—"),
            },
            {
                title: "Haber",
                dataIndex: "credit",
                key: "credit",
                align: "right",
                width: 120,
                render: (val) => (val ? `$ ${formatNumberES(val)}` : "—"),
            },
            {
                title: "Balance",
                dataIndex: "runningBalance",
                key: "runningBalance",
                align: "right",
                width: 140,
                render: (val) => `$ ${formatNumberES(val ?? 0)}`,
            },
        ],
        []
    );

    return (
        <div style={{ display: "grid", gap: 12 }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Space direction="vertical" size={0}>
                    <SubTitle>Libro mayor mensual</SubTitle>
                </Space>

                <DatePicker
                    picker="month"
                    value={dayjs(
                        `${year}-${String(month).padStart(2, "0")}-01`
                    )}
                    onChange={onChangeMonth}
                    allowClear={false}
                />
            </div>

            <div
                ref={scrollRef}
                style={{ maxHeight: 680, overflow: "auto", borderRadius: 6 }}
            >
                <Table
                    size="small"
                    bordered
                    sticky
                    rowKey={(r, i) =>
                        `${r._synthetic || "row"}-${r.referenceId || i}-${
                            r.date
                        }`
                    }
                    columns={columns}
                    dataSource={[...rows, ...rows, ...rows, ...rows]}
                    loading={loading}
                    pagination={false}
                    summary={() => (
                        <Table.Summary  fixed>
                            <Table.Summary.Row >
                                <Table.Summary.Cell index={0} colSpan={2}>
                                    <Text style={styles.summary} type="secondary">
                                        Saldo de cierre
                                    </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell
                                    index={2}
                                    colSpan={3}
                                    align="right"
                                >
                                    <Text style={styles.summary} strong>

                                        $ {formatNumberES(closingBalance)}
                                    </Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>
        </div>
    );
};


const styles = {
    summary: {
        fontSize: 18,
        lineHeight: 2.5
    }
}