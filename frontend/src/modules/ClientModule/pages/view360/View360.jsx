import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Inner, Main } from "./styles";
import Layout from "../../../../components/common/layout";
import Sidebar from "./sidebar/Sidebar";
import { GeneralInformation } from "./main/components/general-information/GeneralInformation";
import { Files } from "./main/components/files/Files";
import { get_client_by_id } from "../../api/general/general";
import { Divider } from "antd";
import Header from "./header/Header";

const View = () => {
    const { id } = useParams();
    const [activeKey, setActiveKey] = useState("GeneralInfo");
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(null);

    useEffect(() => {
        const getClient = async () => {
            try {
                setLoading(true);
                const client = await get_client_by_id(id);
                setClient(client?.payload || {});
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(true);
            }
        };

        getClient();
    }, []);

    return (
        <Layout className="Inner ">
            <Sidebar activeKey={activeKey} setActiveKey={setActiveKey} />
            <Inner>
                <Header data={client} />
                <Main>
                    {activeKey === "GeneralInfo" && (
                        <GeneralInformation id={id} data={client} />
                    )}
                    {activeKey === "Files" && <Files id={id} data={client} />}
                </Main>
            </Inner>
        </Layout>
    );
};

export default View;
