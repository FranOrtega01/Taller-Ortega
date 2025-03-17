export function SuccessResponse(res, data, statusCode = 200) {
    return res.status(statusCode).json({
        status: "success",
        payload: data
    });
}

export function ErrorResponse(res, errorOrMessage, statusCode = 500) {

    if (typeof errorOrMessage === "object" && errorOrMessage !== null) {
        return res.status(errorOrMessage.statusCode || statusCode || 500).json({
            status: "error",
            message: errorOrMessage.message || "Error desconocido",
            errorMessages: errorOrMessage.errorMessages || []
        });
    }

    return res.status(statusCode).json({
        status: "error",
        message: errorOrMessage || "Error desconocido"
    });
}
