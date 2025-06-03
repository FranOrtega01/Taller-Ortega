import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { GoBackLink, Inner, Title, Container } from "./styles";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeKey, setActiveKey }) => {
    const [tabItems, setTabItems] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        setTabItems([
            { label: "General Information", key: "GeneralInfo" },
            { label: "Owner", key: "VehicleOwner" },

        ]);
    }, []);

    const onTabChange = (key) => {
        setActiveKey(key);
    };

    return (
        <Inner>
            <Title>
                <GoBackLink>
                    <div style={{cursor: "pointer"}} onClick={() => navigate(-1)}>x</div>
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
                    tabBarStyle={{
                        width: "200px",
                    }}
                />
            </Container>
        </Inner>
    );
};

export default Sidebar;
