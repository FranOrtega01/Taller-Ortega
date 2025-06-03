import React from "react";

export const Vehicle = ({ id, data }) => {
    return (
        <>
            <div>{data?.vehicle?.licensePlate}</div>
            <div>{data?.vehicle?.brand}</div>
            <div>{data?.vehicle?.model}</div>
            <div>{data?.vehicle?.year}</div>
            <div>{data?.vehicle?.color}</div>
        </>
    );
};
