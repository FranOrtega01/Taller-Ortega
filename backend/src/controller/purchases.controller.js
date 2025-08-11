import mongoose from "mongoose";
import {
    PurchaseService,
    SupplierService,
    SupplierAccountMovementService,
} from "../repository/index.js";
import { ErrorResponse, SuccessResponse } from "./customResponse.js";
import { SUPPLIER_ACCOUNT_MOVEMENT_ORIGIN } from "../DAO/mongo/models/utils.js";
import { createSupplierAccountMovement } from "../schemas/supplierAccountMovement.schema.js";

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
    const session = await mongoose.startSession(); // Start Session in case of rollback @Fran
    try {
        session.startTransaction(); // Start Transaction @Fran

        // Format data and create Purchase
        const data = formatPurchase(req?.body);
        const purchase = await PurchaseService.create(data, { session });

        // Check if supplier exists and create SupplierTransaction
        let supplier = null;
        try {
            supplier = await SupplierService.getByCUIT(purchase?.supplierCUIT);
        } catch {}

        if (supplier) {
            const txPayload = createSupplierAccountMovement.parse({
                supplier: supplier._id.toString(),
                date: purchase?.date ?? undefined,
                concept: purchase.concept,
                credit: 0,
                debit: purchase.total,
                currency: purchase.currency ?? undefined,
                method: purchase.method ?? "INVOICE",
                origin: "PURCHASE",
                referenceId: purchase._id.toString(),
            });
                
            await SupplierAccountMovementService.create(txPayload, { session });
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
