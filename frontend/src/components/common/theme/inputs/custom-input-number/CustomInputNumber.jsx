import React from "react";
import { InputNumber } from "antd";

export const CustomInputNumber = ({...props}) => {
    return (
        <InputNumber
            {...props}
            formatter={(value) => {
                if (!value) return "";
                const [int, dec] = value.toString().split(".");
                const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                return dec !== undefined
                    ? `${formattedInt},${dec}`
                    : formattedInt;
            }}
            parser={(value) => {
                if (!value) return "";
                return value
                    .replace(/\./g, "") 
                    .replace(",", "."); 
            }}
        />
    );
};
