import { Tabs } from "antd";
import styled from "styled-components";

export const CleanEditableTabs = styled(Tabs)`
    &.ant-tabs-card {
        border: none;
    }

    .ant-tabs-nav {
        margin-bottom: 0;
    }

    .ant-tabs-tab {
        background: transparent !important;
        border: none !important;
    }

    .ant-tabs-tab-active {
        background: transparent !important;
        border: none !important;
    }

    .ant-tabs-content-holder {
        border: none !important;
    }

    .ant-tabs-nav-wrap {
        border-bottom: 1px solid #f0f0f0; /* opcional */
    }
`;
