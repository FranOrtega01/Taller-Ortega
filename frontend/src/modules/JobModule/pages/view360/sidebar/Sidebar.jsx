import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { GoBackLink, InnerSidebar, Title, Container } from '../../../../../components/common/sidebar/styles';
import { Link } from "react-router-dom";
import {t} from '../../../../../customHooks/useTranslation'
const Sidebar = ({ activeKey, setActiveKey, isParticular}) => {
    const [tabItems, setTabItems] = useState([]);

    useEffect(() => {
        const items = isParticular
            ? [
                { label: t("general-info-lbl") , key: "GeneralInfo" },
                { label: t("estimate-lbl") , key: "Estimate" },
                { label: t("client-lbl") , key: "Client" },
                { label: t("vehicle-lbl") , key: "Vehicle" },
                { label: t("file-lbl") , key: "Files" },
                { label: t("invoice-lbl") , key: "Invoices" },
            ]
            : [
                { label: t("general-info-lbl") , key: "GeneralInfo" },
                { label: t("estimate-lbl") , key: "Estimate" },
                { label: t("claims-lbl") , key: "Claims" },
                { label: t("vehicle-lbl") , key: "Vehicle" },
                { label: t("client-lbl") , key: "Client" },
                { label: t("file-lbl") , key: "Files" },
                { label: t("invoice-lbl") , key: "Invoices" },
            ];
        setTabItems(items);
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
                style={{height: "100%"}}
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
