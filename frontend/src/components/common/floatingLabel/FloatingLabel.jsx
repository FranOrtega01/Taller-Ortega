import { Tooltip } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { Inner, Label } from "./styles.js";

export default function FloatingLabel({
    label,
    value,
    children,
    hint,
    hasPrefix,
    ...restProps
}) {
    const ref = useRef();
    const [onFocus, setOnFocus] = useState(false);

    useEffect(() => {
        const onBodyClick = (event) => {
            if (ref.current.contains(event.target)) return;
            setOnFocus(false);
        };

        document.body.addEventListener("click", onBodyClick, { capture: true });

        return () => {
            document.body.removeEventListener("click", onBodyClick, {
                capture: true,
            });
        };
    }, []);

    return (
        <Inner
            ref={ref}
            onFocus={() => setOnFocus(true)}
            onBlur={() => setOnFocus(false)}
            {...restProps}
        >
            <Tooltip title={hint} placement="left" zIndex={999}>
                {children}
                <Label $hasPrefix={hasPrefix} $hasFocus={value || value === 0 || onFocus}>
                    {label}
                </Label>
            </Tooltip>
        </Inner>
    );
}
