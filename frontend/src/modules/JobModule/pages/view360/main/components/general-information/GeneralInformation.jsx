import React, { useEffect, useState } from "react";
import { Parts } from "./components/parts/Parts";
import { Description } from "./components/description/Description";
import { WorkPanels } from "./components/work-panels/WorkPanels";
import FloatingLabel from "../../../../../../../components/common/floatingLabel/FloatingLabel";
import { FixedFooter } from '../../../styles'
import { Spin, Form, DatePicker, Button } from "antd";
import { CustomInputNumber } from "../../../../../../../components/common/theme/inputs/custom-input-number/CustomInputNumber";
import dayjs from "dayjs";
import { update_job_general_info } from "../../../../../../../services/api/general/general";

export const GeneralInformation = ({ id, data, refreshData, canEdit }) => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);

    const handleFinish = async (values) => {
        try {
            console.log("Form values:", values);
            const payload = {
                workPanels: values?.workPanels,
                amount: values?.amount,
                entryDate: dayjs(values?.entryDate)
            }
            await update_job_general_info(id, payload);
            refreshData()
        } catch (error) {
            console.error("Error on submit:", error);
        }
    };

    if (!data) return <Spin />;
    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                entryDate: data?.entryDate ? dayjs(data.entryDate) : null,
                amount: data?.expenses?.amount,
            }}
            onFinish={handleFinish}
            style={{
                marginTop:"1rem"
            }}
        >
            {/* <Description description={data?.description} /> */}

            <FloatingLabel
                label="Fecha de ingreso"
                name="entryDate"
                value={formValues?.entryDate}
            >
                <Form.Item
                    name="entryDate"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese la fecha de ingreso",
                        },
                    ]}
                >
                    <DatePicker placeholder="" style={{ width: "100%" }} format="DD/MM/YY" />
                </Form.Item>
            </FloatingLabel>

            <FloatingLabel
                label="Monto"
                name="amount"
                value={formValues?.amount}
            >
                <Form.Item
                    name="amount"
                    rules={[{ required: true, message: "Ingrese el monto" }]}
                >
                    <CustomInputNumber addonBefore="$" style={{ width: "100%" }} min={0} />
                </Form.Item>
            </FloatingLabel>

            {/* {data?.parts && (
                <Parts
                    refreshData={refreshData}
                    parts={data?.parts}
                    jobId={id}
                />
            )} */}
            <WorkPanels
                canEdit={canEdit}
                jobId={id}
                workPanels={data?.workPanels}
                form={form}
            />

            <FixedFooter>
                <Button type="primary" htmlType="submit">
                    Guardar
                </Button>
            </FixedFooter>
        </Form>
    );
};
