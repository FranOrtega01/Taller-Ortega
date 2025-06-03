import { CompanyService } from "../repository/index.js";
import { ErrorResponse, SuccessResponse } from "./customResponse.js";
import mongoose from "mongoose";

export const get = async (req, res) => {
    try {
        const { format } = req.query;

        let companies;

        switch (format) {
            case "dropdown":
                companies = await CompanyService.getForDropdown();
                break;
            case undefined:
            case null:
                companies = await CompanyService.get();
                break;
            default:
                return ErrorResponse(res, "Invalid format", 400);
        }

        return SuccessResponse(res, companies);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getByID = async (req, res) => {
    try {
        const { id } = req.params;

        let company;
        if (mongoose.Types.ObjectId.isValid(id)) {
            company = await CompanyService.getByID(id);
        } else if (/^\d{11}$/.test(id)) {
            company = await CompanyService.getByCUIT(id);
        } else {
            return ErrorResponse(
                res,
                "Parámetro inválido. Debe ser un ObjectId o un CUIT de 11 dígitos.",
                400
            );
        }
        return SuccessResponse(res, company);
    } catch (error) {
        if (
            error.message === "Compania no encontrada" ||
            error?.errorMessages?.[0] === "Compania no encontrada"
        ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const getForDropdown = async (req, res) => {
    try {
        return SuccessResponse(res, companies);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const create = async (req, res) => {
    try {
        const company = await CompanyService.create(req?.body);
        return SuccessResponse(res, company);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const update = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "La Compania debe tener información", 400);
    try {
        const { id } = req.params;
        if (req.body._id) delete req.body._id;
        const company = await CompanyService.update(id, req?.body);
        return SuccessResponse(res, company);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        await CompanyService.delete(id);
        return SuccessResponse(res);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};
