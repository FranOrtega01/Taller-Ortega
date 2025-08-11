import { Card, Col, Row, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import {
    SearchOutlined,
    PlusCircleOutlined,
    BarChartOutlined,
    DollarOutlined,
    ShoppingOutlined
} from "@ant-design/icons";
import Layout from "../../../../components/common/layout";

const { Title } = Typography;

const Home = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Layout.Body>
                <Title level={3}>Gestión de Presupuestos</Title>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title="Presupuestos"
                            variant="bordered"
                            actions={[
                                <Button
                                    type="primary"
                                    icon={<DollarOutlined />}
                                    onClick={() => navigate("search")}
                                >
                                    Presupuestos
                                </Button>,
                            ]}
                        >
                            Visualizá y gestioná Presupuestos existentes.
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title="Presupuestos"
                            variant="bordered"
                            actions={[
                                <Button
                                    type="primary"
                                    icon={<ShoppingOutlined />}
                                    onClick={() => navigate("create")}
                                >
                                    Cargar Presupuesto
                                </Button>,
                            ]}
                        >
                            Presupuesto un nuevo presupuesto.
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title="Estadísticas"
                            variant="bordered"
                            actions={[
                                <Button
                                    icon={<BarChartOutlined />}
                                    onClick={() => navigate("stats")}
                                >
                                    Ver
                                </Button>,
                            ]}
                        >
                            Próximamente: métricas generales del taller.
                        </Card>
                    </Col>
                </Row>
            </Layout.Body>
        </Layout>
    );
};

export default Home;
