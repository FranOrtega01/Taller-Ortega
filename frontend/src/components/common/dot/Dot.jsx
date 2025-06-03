import React from "react";
import { theme } from "antd";

export const Dot = ({ size = 8, color = "blue", ...props}) => {
    // Usa token de colores de Ant Design si está dentro de ConfigProvider
    const { token } = theme.useToken();

    return (
        <span
            style={{
                display: "inline-block",
                width: size,
                height: size,
                ...props.style,
                borderRadius: "50%",
                backgroundColor: color,
            }}
        />
    );
};

