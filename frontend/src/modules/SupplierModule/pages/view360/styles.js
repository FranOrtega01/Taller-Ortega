import styled from "styled-components";
import COLORS from "../../../../components/common/theme/colors";
import TYPO from "../../../../components/common/theme/typo";

export const Inner = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 25px 50px;
	padding-right: 80px;
	flex: 1 1 0%;
	& .ant-divider-horizontal {
		margin: 0 !important;
	}
`;

export const Main = styled.div`
	// flex: 1;
	// display: flex;
	// flex-direction: column;
	// padding: 20px;
`;

export const Header = styled.header`
	height: 60px;
	background-color: #fff;
	border-bottom: 1px solid #ddd;
	display: flex;
	align-items: center;
	padding: 0 20px;
`;

export const Subtitle = styled(TYPO.H2)`
	font-size: 24px;
`