import React, { useState, useEffect } from "react";
import { get_vehicle_owner_by_license_plate } from "../../../../../../../services/api/general/general";
import { useParams } from "react-router-dom";

export const VehicleOwner = () => {
    const { licensePlate } = useParams();

    const [loading, setLoading] = useState(false);
    const [owner, setOwner] = useState(null);

    const getOwner = async () => {
        try {
            setLoading(true);
            const res = await get_vehicle_owner_by_license_plate(licensePlate);
            console.log("Owner: ", res?.payload);
            setOwner(res?.payload || {});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getOwner();
    }, []);

    return <>
    <div>owner</div>
    <div>{owner?.name}</div>
    </>;
};
