import React from "react";
import { Row, Col } from "antd";
export const Claims = ({ id, data }) => {
    return (
        <>
            <Row style={{marginBottom: "2rem"}}>
                <Col span={12}>Total Claims</Col>
                <span>{data?.companyData?.claims?.totalClaims}</span>
            </Row>
            <Row>
                <Col span={12}>Active Claims</Col>
                <span>{data?.companyData?.claims?.activeClaims}</span>
            </Row>
        </>
    );
};
