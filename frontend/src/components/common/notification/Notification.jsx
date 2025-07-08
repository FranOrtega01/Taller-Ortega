import { notification } from "antd";

export const NOTIFICATION_TYPE = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
};

export const showNotification = (
    type,
    message,
    description = "",
    placement = "topRight"
) => {
    notification[type]({
        message,
        description,
        placement,
        style: { padding: "1rem", width: 350 },
    });
};
