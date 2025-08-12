import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Inner, Main } from "./styles";
import Layout from "../../../../components/common/layout";
import Sidebar from "./sidebar/Sidebar";
import { GeneralInformation } from "./main/components/general-information/GeneralInformation";
import { Account } from "./main/components/account/Account";
import { get_supplier_by_id } from "../../../../services/api/general/general";
import Header from "./header/Header";

const View = () => {
    const { id } = useParams();
    const [activeKey, setActiveKey] = useState("Account");
    const [loading, setLoading] = useState(false);
    const [supplier, setSupplier] = useState(null);

    useEffect(() => {
        const getSupplier = async () => {
            try {
                setLoading(true);
                const supplier = await get_supplier_by_id(id);
                setSupplier(supplier?.payload || {});
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(true);
            }
        };

        getSupplier();
    }, []);

    return (
        <Layout className="Inner ">
            <Sidebar activeKey={activeKey} setActiveKey={setActiveKey} />
            <Inner>
                <Header data={supplier} />
                <Main>
                    {activeKey === "GeneralInfo" && (
                        <GeneralInformation id={id} data={supplier} />
                    )}

                    {activeKey === "Account" && <Account id={id} data={supplier} />}

                </Main>
            </Inner>
        </Layout>
    );
};

export default View;
