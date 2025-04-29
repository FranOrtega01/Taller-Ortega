import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { GoBackLink, InnerSidebar, Title, Container } from '../../../../../components/common/sidebar/styles';
import { Link } from "react-router-dom";

const Sidebar = ({ activeKey, setActiveKey }) => {
    const [tabItems, setTabItems] = useState([]);

    useEffect(() => {
        setTabItems([
            { label: "general-info-lbl", key: "GeneralInfo" },
            { label: "claims-lbl", key: "Claims" },
            { label: "vehicle-lbl", key: "Vehicle" },
            { label: "client-lbl", key: "Client" },
            { label: "file-lbl", key: "Files" },
            { label: "invoice-lbl", key: "Invoices" },
        ]);
    }, []);

    const onTabChange = (key) => {
        setActiveKey(key);
    };

    return (
        <InnerSidebar>
            <Title>
                <GoBackLink>
                    <Link to="/trabajos/search" style={{ color: "inherit" }}>
                        {'<'}
                    </Link>
                </GoBackLink>
            </Title>
            <Container>
                <Tabs
                    defaultActiveKey={activeKey}
                    type="line"
                    tabPosition="left"
                    onChange={onTabChange}
                    activeKey={activeKey}
                    items={tabItems.map((item) => ({
                        label: item.label,
                        key: item.key,
                    }))}
                />
            </Container>
        </InnerSidebar>
    );
};

export default Sidebar;
