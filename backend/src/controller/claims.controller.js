import { ClaimService } from '../repository/index.js'
import { ErrorResponse, SuccessResponse } from "./customResponse.js";
import { CLAIM_STATUS_ENUM } from '../DAO/mongo/models/utils.js';

export const get = async (req, res) => {
    try {
        const claims = await ClaimService.get()
        return SuccessResponse(res, claims)
    } catch (error) {
        return ErrorResponse(res, error)
    }
}

export const getByID = async (req, res) => {
    try {
        const claim = await ClaimService.getByID(req.params.id)
        return SuccessResponse(res, claim)
    } catch (error) {
        if (
            error.message === "Siniestro no encontrado" ||
            error?.errorMessages?.[0] === "Siniestro no encontrado"
        ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error)
    }
}
export const create = async (req, res) => {
    try {
        const claim = await ClaimService.create(req.body)
        return SuccessResponse(res, claim)
    } catch (error) {
        return ErrorResponse(res, error)
    }
}

export const updateActiveClaim = async (req, res) => {
    if(Object.keys(req.body).length === 0) {
        return ErrorResponse(res, "El Siniestro debe tener información", 400)
    }
    if(req.body.status !== CLAIM_STATUS_ENUM.ACTIVE.code) {
        return ErrorResponse(res, "El Siniestro debe estar activo", 400)
    }
    try {
        const claim = await ClaimService.updateActiveClaim(req.params.id, req.body)
        return SuccessResponse(res, claim)
    } catch (error) {
        return ErrorResponse(res, error)
    }
}

export const deleteOne = async (req, res) => {
    try {
        const claim = await ClaimService.delete(req.params.id)
        return SuccessResponse(res, claim)
    } catch (error) {
        return ErrorResponse(res, error)
    }
}

export const activateClaim = async (req, res) => {
    if(Object.keys(req.body).length === 0) {
        return ErrorResponse(res, "El Siniestro debe tener información", 400)
    }
    if (req.body._id) delete req.body.status;    
    try {
        const { id } = req.params;
        const updated = await ClaimService.activate(id, req.body);
        return SuccessResponse(res, updated);
    } catch (error) {
        return ErrorResponse(res, error.message || "Error al activar siniestro", 400);
    }
};

export const createClaimAmp = async (req, res) => {
    try {
        const { parentId } = req.params;
        const claimAmp = await ClaimService.createClaimAmp(parentId, req.body);
        return SuccessResponse(res, claimAmp);
    } catch (error) {
        return ErrorResponse(res, error);
    }
}

