import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Main } from "./styles";
import Layout from "../../../../components/common/layout";
import Sidebar from "./sidebar/Sidebar";
import { GeneralInformation } from "./main/components/general-information/GeneralInformation";
import { Files } from "./main/components/files/Files";
import { get_job_by_id } from "../../api/general/general";
import Header from "./header/Header";

const View = () => {
    const { id } = useParams();
    const [activeKey, setActiveKey] = useState("GeneralInfo");
    const [loading, setLoading] = useState(false);
    const [job, setJob] = useState(null);

    useEffect(() => {
        const getJob = async () => {
            try {
                setLoading(true);
                const job = await get_job_by_id(id);
                setJob(job?.payload || {});
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(true);
            }
        };

        getJob();
    }, []);

    return (
        <Layout>
            <Sidebar activeKey={activeKey} setActiveKey={setActiveKey} />
            <Layout.Body>
                <Header data={job} />
                <Main>
                    {activeKey === "GeneralInfo" && (
                        <GeneralInformation id={id} data={job} />
                    )}
                    {activeKey === "Files" && <Files id={id} data={job} />}
                </Main>
            </Layout.Body>
        </Layout>
    );
};

export default View;
