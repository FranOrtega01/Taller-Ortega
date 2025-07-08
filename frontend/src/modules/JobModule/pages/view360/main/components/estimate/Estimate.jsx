import React, { useState, useEffect } from "react";
import { Row, Col, Statistic, Tag, Button} from "antd";
import moment from "moment";
import Layout from "../../../../../../../components/common/layout";
import { t } from "../../../../../../../customHooks/useTranslation";
import {
    formatNumberES,
    estimateStatusColor,
} from "../../../../../../../services/utils";
import { StatisticTag } from "../../../../../../../components/common/statisticTag/StatisticTag";

export const Estimate = ({ data }) => {
    return (
        <>
            <Layout.SubTitle>{t("estimate-title")}</Layout.SubTitle>
            {data?.estimate ? (
                <>
                    <Row style={{ gap: "5rem" }}>
                        <Statistic
                            title={t("estimate-date-lbl")}
                            value={
                                data?.estimate
                                    ? moment(
                                          data?.estimate?.creationDate
                                      ).format("DD/MM/YY")
                                    : "-"
                            }
                        />

                        <Statistic
                            title={t("estimate-amount-lbl")}
                            value={`$${
                                data?.estimate
                                    ? formatNumberES(data?.estimate?.price, 2)
                                    : "-"
                            }`}
                        />

                        <StatisticTag
                            title={t("estimate-status-lbl")}
                            color={estimateStatusColor(
                                data?.estimate?.status.code
                            )}
                            value={data?.estimate?.status.name}
                        />
                    </Row>
                    <Layout.SubTitle>
                        {t("estimate-payments-lbl")}
                    </Layout.SubTitle>
                    {data?.estimate?.payments &&
                    data?.estimate?.payments.length > 0 ? (
                        data.estimate.payments.map((p) => (
                            <span key={`${p._id}`}>{`${moment(p.date).format(
                                "DD/MM/YY"
                            )}  -  $${formatNumberES(p.amount, 2)}  -  ${
                                p.method
                            }`}</span>
                        ))
                    ) : (
                        <span>{t("no-payments-lbl")}</span>
                    )}
                </>
            ) : (
                <>
                    <span>{t("no-estimate-lbl")}</span>
                    <Button type="link" >+{t("upload-estimate-lbl")}</Button>
                </>
            )}
        </>
    );
};
