import mongoose from "mongoose";
import {
    PurchaseService,
    SupplierService,
    SupplierTransactionService,
} from "../repository/index.js";
import { ErrorResponse, SuccessResponse } from "./customResponse.js";

const formatPurchase = (purchase) => {
    if (purchase._id) {
        delete purchase._id;
    }

    if (purchase.netAmount21 !== undefined) {
        purchase.netAmount21 = parseFloat(purchase.netAmount21.toFixed(2));
    }
    if (purchase.netAmount10 !== undefined) {
        purchase.netAmount10 = parseFloat(purchase.netAmount10.toFixed(2));
    }
    if (purchase.iibb !== undefined) {
        purchase.iibb = parseFloat(purchase.iibb.toFixed(2));
    }
    if (Array.isArray(purchase.internalTaxes)) {
        purchase.internalTaxes.forEach((tax) => {
            if (tax.amount !== undefined) {
                tax.amount = parseFloat(tax.amount.toFixed(2));
            }
        });
    }

    return purchase;
};

export const get = async (req, res) => {
    try {
        const purchases = await PurchaseService.get();
        return SuccessResponse(res, purchases);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getByID = async (req, res) => {
    try {
        const { id } = req.params;

        const purchase = await PurchaseService.getByID(id);
        return SuccessResponse(res, purchase);
    } catch (error) {
        if (
            error.message === "Compra no encontrada" ||
            error?.errorMessages?.[0] === "Compra no encontrada"
        ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const create = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "La Compra debe tener información", 400);
    if (!req?.body?.supplierCUIT) {
        return ErrorResponse(res, "El Proveedor es obligatorio", 400);
    }
    if (!req?.body?.netAmount21 && !req?.body?.netAmount10) {
        return ErrorResponse(res, "El Monto es obligatorio", 400);
    }
    const session = await mongoose.startSession(); // Start Session in case of rollback @Fran
    try {
        session.startTransaction(); // Start Transaction @Fran

        // Format data and create Purchase
        const data = formatPurchase(req?.body);
        const purchase = await PurchaseService.create(data, { session });

        // Check if supplier exists and create SupplierTransaction
        let supplier;
        try {
            supplier = await SupplierService.getByCUIT(purchase?.supplierCUIT);
        } catch {
            supplier = null;
        }
        if (supplier) {
            const supplierTransactionPayload = {
                supplier: supplier?._id,
                concept: purchase?.concept,
                credit: purchase?.total,
                purchase: purchase?._id,
            };
            await SupplierTransactionService.create(
                supplierTransactionPayload,
                { session }
            );
        }
        // If all ok, commit transaction
        await session.commitTransaction();
        session.endSession();
        return SuccessResponse(res, purchase);
    } catch (error) {
        // If error, abort transaction
        console.log("ABORTED");
        await session.abortTransaction();
        session.endSession();
        return ErrorResponse(res, error);
    }
};

export const update = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "La Compra debe tener información", 400);
    try {
        const { id } = req.params;
        if (req.body._id) delete req.body._id;
        const purchase = await PurchaseService.update(id, req?.body);
        return SuccessResponse(res, purchase);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        await PurchaseService.delete(id);
        return SuccessResponse(res);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

