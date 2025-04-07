import { SupplierService } from "../repository/index.js";
import { ErrorResponse, SuccessResponse } from "./customResponse.js";
import mongoose from "mongoose";

export const get = async (req, res) => {
    try {
        const suppliers = await SupplierService.get();
        return SuccessResponse(res, suppliers);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getByID = async (req, res) => {
    try {
        const { id } = req.params;
        let supplier;
        if (mongoose.Types.ObjectId.isValid(id)) {
            supplier = await SupplierService.getByID(id);
        } else if (/^\d{11}$/.test(id)) {
            supplier = await SupplierService.getByCUIT(id);
        } else {
            return ErrorResponse(
                res,
                "Parámetro inválido. Debe ser un ObjectId o un CUIT de 11 dígitos.",
                400
            );
        }
        return SuccessResponse(res, supplier);
    } catch (error) {
        if (
            error.message === "Proveedor no encontrado" ||
            error?.errorMessages?.[0] === "Proveedor no encontrado"
        ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const create = async (req, res) => {
    try {
        if (!Object.keys(req.body).length)
            return ErrorResponse(res, "El Proveedor debe tener información", 400);
        const supplier = await SupplierService.create(req?.body);
        return SuccessResponse(res, supplier);
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
        const supplier = await SupplierService.update(id, req?.body);
        return SuccessResponse(res, supplier);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        await SupplierService.delete(id);
        return SuccessResponse(res);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};
