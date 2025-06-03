import React, { useEffect, useState } from "react";
import Layout from "../../../../../components/common/layout";
import { Divider, Row, Col, Tag, Button } from "antd";
import {
    formatLicense,
    formatDate,
    jobIsCompanyColor,
} from "../../../../../services/utils";

const Header = ({ data, getBtnLabel }) => {
    return (
        <Layout.Header>
            <Row>
                <Col>
                    <Row>{formatLicense(data?.vehicle?.licensePlate)}</Row>
                    <Row>{formatDate(data?.date)}</Row>
                    <Row>{`${data?.vehicle?.brand} ${data?.vehicle?.model}`}</Row>
                    <Tag
                        color={jobIsCompanyColor(
                            data?.isParticular
                                ? "Particular"
                                : data?.companyData?.company
                        )}
                    >
                        {data?.isParticular
                            ? "Particular"
                            : data?.companyData?.company}
                    </Tag>
                </Col>
                <Col>
                    <Tag
                        color={"gold"}
                    >
                        {data?.status?.name}
                    </Tag>
                    <Button>{getBtnLabel(data)}</Button>
                </Col>
            </Row>
            <Divider />
        </Layout.Header>
    );
};

export default Header;
