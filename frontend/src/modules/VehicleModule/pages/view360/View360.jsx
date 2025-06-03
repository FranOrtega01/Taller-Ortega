import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Inner, Main } from "./styles";
import Layout from "../../../../components/common/layout";
import Sidebar from "./sidebar/Sidebar";
import { GeneralInformation } from "./main/components/general-information/GeneralInformation";
import { Files } from "./main/components/files/Files";
import { VehicleOwner } from "./main/components/vehicle-owner/VehicleOwner";
import { Divider } from "antd";
import Header from "./header/Header";
import { get_vehicle_by_license_plate } from "../../../../services/api/general/general";

const View = () => {
    const { licensePlate } = useParams();
    const [activeKey, setActiveKey] = useState("GeneralInfo");
    const [loading, setLoading] = useState(false);
    const [vehicle, setVehicle] = useState(null);
    useEffect(() => {
        const getVehicle = async () => {
            try {
                setLoading(true);
                const vehicle = await get_vehicle_by_license_plate(
                    licensePlate
                );
                setVehicle(vehicle?.payload || {});
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(true);
            }
        };

        getVehicle();
    }, []);

    return (
        <Layout>
            <Sidebar activeKey={activeKey} setActiveKey={setActiveKey} />
            <Inner>
                <Header data={vehicle} />
                <Main>
                    {activeKey === "GeneralInfo" && (
                        <GeneralInformation
                            fetchingVehicle={loading}
                            licensePlate={licensePlate}
                            data={vehicle}
                        />
                    )}
                    {activeKey === "Files" && (
                        <Files licensePlate={licensePlate} data={vehicle} />
                    )}

                    {activeKey === "VehicleOwner" && (
                        <VehicleOwner
                            licensePlate={licensePlate}
                            data={vehicle}
                        />
                    )}
                </Main>
            </Inner>
        </Layout>
    );
};

export default View;
