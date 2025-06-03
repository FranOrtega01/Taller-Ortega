import styled from "styled-components";
import COLORS from '../../../../../components/common/theme/colors'

export const Inner = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-end;
	padding-right: 0;
	background: ${COLORS.BACK};
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
	height: 100px;
	width: 100%;
`;

export const GoBackLink = styled.div`
	padding-top: 12px;
	padding-left: 35px;
	& .anticon svg {
		height: 18px !important;
		width: 18px !important;
	}
`;

export const Container = styled.div`
	display: flex;
	margin-top: 22px;
	flex-direction: column;
	justify-content: felx-start;
	align-items: flex-end;
	height: 100%;
	padding-bottom: 10%;
	& .ant-tabs-tab-btn {
		text-overflow: ellipsis !important;
		overflow: hidden !important;
		width: 160px !important;
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
