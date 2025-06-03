import React from "react";
import { Skeleton } from "antd";
import styled from "styled-components";
import { InnerSidebar } from "../styles";
import COLORS from "../../theme/colors";

const SidebarContainer = styled.div`
    background: ${COLORS.BACK};
    height: 100%;
    & .ant-tabs-tab-active {
        background-color: ${COLORS.WHITE};
    }
    & .ant-tabs-content {
        width: 0 !important;
    }
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const SkeletonSidebar = ({ lines, ...props }) => {
    return (
        <SidebarContainer {...props}>
            {[...Array(lines)].map((_, index) => (
                <Skeleton.Input
                    key={index}
                    active
                    size="default"
                    style={{ width: "100%", height: 16, borderRadius: 4 }}
                />
            ))}
        </SidebarContainer>
    );
};

export default SkeletonSidebar;
