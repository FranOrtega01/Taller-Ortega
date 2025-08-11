import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { GoBackLink, Inner, Title, Container } from "./styles";
import { useNavigate } from "react-router-dom";
import {t} from "../../../../../customHooks/useTranslation"
const Sidebar = ({ activeKey, setActiveKey }) => {
    const [tabItems, setTabItems] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        setTabItems([
            { label: t("general-information-lbl"), key: "GeneralInfo" },
            { label: t("account-lbl"), key: "Account" },
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
