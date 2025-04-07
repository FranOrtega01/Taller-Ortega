import { ClientService } from "../repository/index.js";
import { ErrorResponse, SuccessResponse } from "./customResponse.js";
export const get = async (req, res) => {
    try {
        const clients = await ClientService.get();
        return SuccessResponse(res, clients);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await ClientService.getById(id);
        return SuccessResponse(res, client);
    } catch (error) {
        if (error.message === "Cliente no encontrado" || error?.errorMessages?.[0] === "Cliente no encontrado" ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const create = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El cliente debe tener información", 400);
    try {
        const client = await ClientService.create(req?.body);
        return SuccessResponse(res, client);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const update = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Cliente debe tener información", 400);
    try {
        const { id } = req.params;
        if (req.body._id) delete req.body._id;
        const client = await ClientService.update(id, req?.body);
        return SuccessResponse(res, client);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        await ClientService.delete(id);
        return SuccessResponse(res);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};
