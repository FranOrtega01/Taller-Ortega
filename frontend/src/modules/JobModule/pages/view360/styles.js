import styled from "styled-components";
import COLORS from "../../../../components/common/theme/colors";
import TYPO from "../../../../components/common/theme/typo";

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

export const SectionTitle = styled(TYPO.H2)``;

export const FixedFooter = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
    position: fixed;
    bottom: 2rem;
`;
