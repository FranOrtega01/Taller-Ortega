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
                <Title level={3}>Gestión de Compras</Title>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title="Compras"
                            variant="bordered"
                            actions={[
                                <Button
                                    type="primary"
                                    icon={<DollarOutlined />}
                                    onClick={() => navigate("search")}
                                >
                                    Compras
                                </Button>,
                            ]}
                        >
                            Visualizá y gestioná Compras existentes.
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title="Gastos"
                            variant="bordered"
                            actions={[
                                <Button
                                    type="primary"
                                    icon={<ShoppingOutlined />}
                                    onClick={() => navigate("create")}
                                >
                                    Gastos
                                </Button>,
                            ]}
                        >
                            Cargá un nuevo cliente.
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
