import styled from "styled-components";
import COLORS from "../theme/colors";
import TYPO from "../theme/typo";

export const Inner = styled.div`
    display: flex;
    height: 100vh;
`;

export const Header = styled.div`
    background-color: white;
    z-index: 101;
`;

export const Body = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 25px 50px;
    flex: 1 1 0%;
`;

export const Main = styled.main`
    flex: 1 1 0%;
    padding: 0;
`;

export const Aside = styled.aside``;

export const Title = styled(TYPO.H1)`
    color: ${COLORS.SECONDARY};
`;

export const SubTitle = styled(TYPO.H2)`
    color: ${COLORS.SECONDARY};
    margin-block: 1rem;
`;

export const Breadcrumb = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 5px;
`;

export const BreadcrumbItem = styled.span`
    font-size: 12px;
    a {
        color: ${COLORS.PRIMARY};
    }
`;

export const BreadcrumbSeparator = styled.div`
    font-size: 10px;
    font-weight: bold;
`;
