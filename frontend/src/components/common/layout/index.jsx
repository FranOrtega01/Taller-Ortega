import React from "react";
import {
    Main,
    Inner,
    Header,
    Body,
    Title,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbSeparator,
    Aside,
} from "./styles.js";

const Layout = ({ children, ...restProps }) => (
    <Inner {...restProps}>{children}</Inner>
);

Layout.Header = ({ children, ...restProps }) => {
    return <Header {...restProps}>{children}</Header>;
};

Layout.Main = ({ children, ...restProps }) => {
    return <Main {...restProps}>{children}</Main>;
};

Layout.Aside = ({ children, ...restProps }) => {
    return <Aside {...restProps}>{children}</Aside>;
};

Layout.Title = ({ children, ...restProps }) => {
    return <Title {...restProps}>{children}</Title>;
};

Layout.Breadcrumb = ({ children, ...restProps }) => {
    return <Breadcrumb {...restProps}>{children}</Breadcrumb>;
};

Layout.BreadcrumbItem = ({ children, ...restProps }) => {
    return <BreadcrumbItem {...restProps}>{children}</BreadcrumbItem>;
};

Layout.BreadcrumbSeparator = ({ children, ...restProps }) => {
    return <BreadcrumbSeparator {...restProps}>/</BreadcrumbSeparator>;
};

Layout.Body = ({ children, ...restProps }) => {
    return <Body {...restProps}>{children}</Body>;
};

export default Layout;
