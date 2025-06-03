import React, { useEffect, useState } from "react";
import Layout from "../../../../../components/common/layout";
import { Divider } from "antd";
import {
    formatLicense,
} from "../../../../../services/utils";

const Header = ({ data }) => {
    return (
        <Layout.Header style={{ marginBottom: "1rem" }}>
            <h1 style={{ marginBottom: "1rem" }}>
                {formatLicense(data?.licensePlate)}
            </h1>
            <Divider />
        </Layout.Header>
    );
};

export default Header;
