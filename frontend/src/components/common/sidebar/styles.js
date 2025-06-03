import styled from "styled-components";
import TYPO from "../theme/typo";
import COLORS from "../theme/colors";

export const InnerSidebar = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    padding-right: 0;
    background: ${COLORS.BACKGROUND_ALT};
    height: 100%;
    & .ant-tabs-tab-active {
        background-color: ${COLORS.WHITE};
    }
    & .ant-tabs-content {
        width: 0 !important;
    }
`;

export const Title = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    height: 5rem;
    width: 100%;
`;

export const GoBackLink = styled.div`
    padding-top: 1rem;
    padding-left: 35px;
    & .anticon svg {
        height: 18px !important;
        width: 18px !important;
    }
`;

export const Container = styled.div`
    display: flex;
    // margin-top: 22px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    height: 100%;
    padding-bottom: 10%;
    & .ant-tabs-tab-btn {
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        width: 160px;
        white-space: nowrap !important;
        text-align: left !important;
    }

    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px #e3e3e3;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${COLORS.GREY};
        border-radius: 10px;
    }
`;

// Steps Sidebar

export const InnerSidebarSteps = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-inline: 1rem;

    background: ${COLORS.BACKGROUND_ALT};
    height: 100%;
    width: 200px;
    overflow-y: auto;
    overflow-x: hidden;
`;

export const StepFlow = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px #e3e3e3;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${COLORS.GREY};
        border-radius: 10px;
    }
`;
