import { EstimateService } from '../repository/index.js'
import { ErrorResponse, SuccessResponse } from './customResponse.js'

export const get = async (req, res) => {
    try {
        const estimates = await EstimateService.get()
        return SuccessResponse(res, estimates);
    } catch (error) {
        return ErrorResponse(res, error);
    }
}

export const getByID = async (req, res) => {
    try {
        const { id } = req.params;

        const estimate = await EstimateService.getByID(id);
        return SuccessResponse(res, estimate);
    } catch (error) {
        if (error.message === "Presupuesto no encontrado" || error?.errorMessages?.[0] === "Presupuesto no encontrado" ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const create = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Presupuesto debe tener información", 400);
    try {
        const estimate = await EstimateService.create(req?.body);
        return SuccessResponse(res, estimate);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const update = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Presupuesto debe tener información", 400);
    try {
        const { id } = req.params;
        if (req.body._id) delete req.body._id;
        const estimate = await EstimateService.update(id, req?.body);
        return SuccessResponse(res, estimate);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        await EstimateService.delete(id);
        return SuccessResponse(res);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};