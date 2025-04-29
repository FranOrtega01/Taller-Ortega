import React, { useEffect, useState } from "react";
import Layout from "../../../../../components/common/layout";
import { Divider } from "antd";

const Header = ({ data }) => {
    console.log(data);

    return (
        <Layout.Header className="header">
            {data?.vehicle?.licensePlate}
            <Divider />
        </Layout.Header>
    );
};

export default Header;
