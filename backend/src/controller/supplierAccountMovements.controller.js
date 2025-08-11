import {
    SupplierAccountMovementService,
    SupplierService,
} from "../repository/index.js";
import { ErrorResponse, SuccessResponse } from "./customResponse.js";
import mongoose from "mongoose";
// import {createSupplierAccountMovement} from '../schema/supplierAccountMovement.schema.js'
import { createSupplierAccountMovement } from "../schemas/supplierAccountMovement.schema.js";
import { formatZodError } from "../utils.js";

export const get = async (req, res) => {
    try {
        const purchases = await SupplierAccountMovementService.get();
        return SuccessResponse(res, purchases);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getByID = async (req, res) => {
    try {
        const { id } = req.params;

        const purchase = await SupplierAccountMovementService.getByID(id);
        return SuccessResponse(res, purchase);
    } catch (error) {
        if (
            error.message === "Movimiento no encontrado" ||
            error?.errorMessages?.[0] === "Movimiento no encontrado"
        ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const getBySupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const purchase = await SupplierAccountMovementService.getBySupplier(id);
        return SuccessResponse(res, purchase);
    } catch (error) {
        if (
            error.message === "Movimiento no encontrado" ||
            error?.errorMessages?.[0] === "Movimiento no encontrado"
        ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const create = async (req, res) => {
    try {
        if (!Object.keys(req.body).length)
            return ErrorResponse(
                res,
                "El Movimiento debe tener información",
                400
            );

        if (!req?.body?.cuit) {
            return ErrorResponse(res, "El CUIT es obligatorio", 400);
        }

        if (!req?.body?.credit && !req?.body?.debit) {
            return ErrorResponse(
                res,
                "El monto Debe o Haber es obligatorio",
                400
            );
        }
        let _id;
        try {
            const supplier = await SupplierService.getByCUIT(req?.body?.cuit);
            _id = supplier?._id;
        } catch {
            _id = null;
        }
        if (!_id) {
            return ErrorResponse(res, "Proveedor no encontrado", 400);
        }
        const payload = {
            supplier: _id,
            date: req?.body?.date,
            concept: req?.body?.concept,
            credit: req?.body?.credit?.toFixed(2),
            debit: req?.body?.debit?.toFixed(2),
        };
        const purchase = await SupplierAccountMovementService.create(payload);
        return SuccessResponse(res, purchase);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const createSupplierPayment = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const supplierId = req.params.id;
        const { credit, date, currency, method } = req.body;

        const txPayload = {
            supplier: supplierId,
            date,
            concept: "Pago a proveedor",
            credit,
            debit: 0,
            currency,
            method: method ?? "TRANSF",
            origin: "PAYMENT",
            referenceId: null,
        };

        const parsed = createSupplierAccountMovement.safeParse(txPayload);
        if (!parsed.success) {
            return res.status(400).json(formatZodError(parsed.error));
        }

        const tx = await SupplierAccountMovementService.create(parsed.data, {
            session,
        });

        await session.commitTransaction();
        return SuccessResponse(res, tx);
    } catch (err) {
        await session.abortTransaction();
        return ErrorResponse(res, err, 400);
    } finally {
        session.endSession();
    }
};

export const update = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Movimiento debe tener información", 400);
    try {
        const { id } = req.params;
        if (req.body._id) delete req.body._id;
        const purchase = await SupplierAccountMovementService.update(
            id,
            req?.body
        );
        return SuccessResponse(res, purchase);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        await SupplierAccountMovementService.delete(id);
        return SuccessResponse(res);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};
