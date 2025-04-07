import { SupplierTransactionService, SupplierService } from "../repository/index.js";
import { ErrorResponse, SuccessResponse } from "./customResponse.js";

const formatPurchase = (purchase) => {
    if (purchase._id) {
        delete purchase._id;
    }

    if (purchase.netAmount !== undefined) {
        purchase.netAmount = parseFloat(purchase.netAmount.toFixed(2));
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
        const purchases = await SupplierTransactionService.get();
        return SuccessResponse(res, purchases);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getByID = async (req, res) => {
    try {
        const { id } = req.params;

        const purchase = await SupplierTransactionService.getByID(id);
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

        if(!req?.body?.credit && !req?.body?.debit){
            return ErrorResponse(res, "El monto Debe o Haber es obligatorio", 400);
        }
        let _id 
        try{
            const supplier = await SupplierService.getByCUIT(req?.body?.cuit);
            _id = supplier?._id;
        } catch  {
            _id = null;
        }
        if (!_id) {
            return ErrorResponse(
                res,
                "Proveedor no encontrado",
                400
            );
        }
        const payload = {
            supplier: _id,
            date: req?.body?.date,
            concept: req?.body?.concept,
            credit: req?.body?.credit?.toFixed(2),
            debit: req?.body?.debit?.toFixed(2),
        }
        const purchase = await SupplierTransactionService.create(payload);
        return SuccessResponse(res, purchase);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const update = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Movimiento debe tener información", 400);
    try {
        const { id } = req.params;
        if (req.body._id) delete req.body._id;
        const purchase = await SupplierTransactionService.update(id, req?.body);
        return SuccessResponse(res, purchase);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        await SupplierTransactionService.delete(id);
        return SuccessResponse(res);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};
