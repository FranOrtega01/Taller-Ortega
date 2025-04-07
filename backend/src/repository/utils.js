import mongoose from "mongoose";

export function handleError(error, model) {
    console.log("ERROR", error);

    let response = {
        message: "Error en la base de datos",
        errorMessages: error?.errorMessages || [],
        statusCode: 500,
    };

    if (error.name === "ValidationError") {
        response.message = "Error de validación";
        response.statusCode = 400;
        Object.values(error.errors).forEach((fieldError) => {
            if (fieldError.kind === "enum") {
                const allowedValues = mongoose.models[model]?.schema.path(fieldError.path)?.enumValues || [];
                response.errorMessages.push(
                    `Error en '${fieldError.path}': '${fieldError.value}' no es un valor permitido.`
                );
                response.errorMessages.push(
                    `Valores permitidos: ${allowedValues.map(v => `"${v}"`).join(", ")}`
                );
            } else {
                response.errorMessages.push(`Error en '${fieldError.path}': ${fieldError.message}`);
            }
        });
    } else if (error.name === "CastError") {
        response.message = "Error de tipo de dato";
        response.statusCode = 400;

        let expectedFormat = "Formato desconocido";
        if (
            mongoose.models[model] &&
            mongoose.models[model].schema.path(error.path)
        ) {
            expectedFormat = generateExpectedFormat(
                mongoose.models[model].schema.path(error.path)
            );
        }

        response.errorMessages.push(
            `Formato incorrecto en '${error.path}'.`,
            expectedFormat,
        );
    } else if (error.code === 11000 || error?.cause?.code === 11000) {
        response.message = "Error de duplicado";
        response.statusCode = 409;
        const duplicatedField =
            Object.keys(
                error?.cause?.keyPattern || error?.keyPattern || {}
            )[0] || "desconocido";
        response.errorMessages.push(
            `El campo '${duplicatedField}' ya está registrado.`,
        );
    } else if (error instanceof TypeError || error instanceof ReferenceError) {
        response.message = "Error interno del servidor";
        response.statusCode = 500;
        response.errorMessages.push(error.message);
    } else {
        response.errorMessages.push(error.message);
    }

    return response;
}

function generateExpectedFormat(schemaPath) {
    if (!schemaPath) return "Formato desconocido";

    switch (schemaPath.instance) {
        case "String":
            return 'Ejemplo: "Texto de ejemplo"';
        case "Number":
            return "Ejemplo: 12345";
        case "Boolean":
            return "Ejemplo: true o false";
        case "Date":
            return 'Ejemplo: "2024-03-08T12:00:00.000Z" (Formato ISO 8601)';
        case "ObjectID":
            return 'Ejemplo: "65fbc12345abcde67890fgh" (MongoDB ObjectId)';
        case "Array":
            return generateArrayExpectedFormat(schemaPath);
        case "Embedded":
        case "Mixed":
            return generateMixedExpectedFormat(schemaPath);
        default:
            return "Formato desconocido";
    }
}

function generateArrayExpectedFormat(schemaPath) {
    if (schemaPath.schema) {
        const schemaKeys = schemaPath.schema.paths;
        const exampleObject = {};
        generateDynamicObjectKeysMsj(schemaKeys, exampleObject)
        return `Ejemplo esperado:${JSON.stringify([exampleObject], null)}`;
    }
    return `Ejemplo esperado:${JSON.stringify(
        ["Elemento1", "Elemento2"],
        null
    )}`;
}

function generateMixedExpectedFormat(schemaPath) {
    if (schemaPath.schema) {
        const schemaKeys = schemaPath.schema.paths;
        const exampleObject = {};
        generateDynamicObjectKeysMsj(schemaKeys, exampleObject)
        return `Ejemplo esperado:${JSON.stringify(exampleObject, null)}`;
    }
    return `Ejemplo esperado:{key: valor}`;
}

function generateDynamicObjectKeysMsj(schemaObjKeys, exampleObj) {
    Object.keys(schemaObjKeys).forEach((key) => {
        if (schemaObjKeys[key].instance === "String") {
            exampleObj[key] = "Ejemplo de texto";
        } else if (schemaObjKeys[key].instance === "Number") {
            exampleObj[key] = 123;
        } else if (schemaObjKeys[key].instance === "Boolean") {
            exampleObj[key] = true;
        } else if (schemaObjKeys[key].instance === "Date") {
            exampleObj[key] = "2024-03-08T12:00:00.000Z";
        }
    });
}