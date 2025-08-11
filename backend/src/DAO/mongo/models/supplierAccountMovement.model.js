import mongoose from "mongoose";
import { formatGMTm3, currencySchema, SUPPLIER_ACCOUNT_MOVEMENT_ORIGIN_CODES, SUPPLIER_ACCOUNT_MOVEMENT_METHOD_CODES } from "./utils.js";

const supplierAccountMovementSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "suppliers",
        required: [true, "El Proveedor es obligatorio"],
    },
    date: {
        type: Date,
        default: () => formatGMTm3(new Date()),
    },
    concept: { type: String, required: [true, "El Concepto es requerido"] },

    credit: {
        type: Number,
        default: 0,
    },
    debit: {
        type: Number,
        default: 0,
    },
    currency: currencySchema,
    method: {
        type: String,
        enum: SUPPLIER_ACCOUNT_MOVEMENT_METHOD_CODES,
        required: true,
    },
    origin: {
        type: String,
        enum: SUPPLIER_ACCOUNT_MOVEMENT_ORIGIN_CODES,
        required: true,
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
});

export default mongoose.model(
    "supplier_account_movements",
    supplierAccountMovementSchema
);
