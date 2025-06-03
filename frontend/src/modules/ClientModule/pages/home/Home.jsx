import { Card, Col, Row, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import {
    SearchOutlined,
    PlusCircleOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import Layout from "../../../../components/common/layout";

const { Title } = Typography;

const Home = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Layout.Body>
                <Title level={3}>Gestión de Clientes</Title>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title="Consultar cliente"
                            variant="bordered"
                            actions={[
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    onClick={() => navigate("search")}
                                >
                                    Ver listado
                                </Button>,
                            ]}
                        >
                            Visualizá y gestioná clientes existentes.
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title="Crear Cliente"
                            variant="bordered"
                            actions={[
                                <Button
                                    type="primary"
                                    icon={<PlusCircleOutlined />}
                                    onClick={() => navigate("create")}
                                >
                                    Nuevo Cliente
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
