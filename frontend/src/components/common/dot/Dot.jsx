import React from "react";

export const Dot = ({ size = 8, color = "blue", ...props }) => {
    return (
        <div
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
