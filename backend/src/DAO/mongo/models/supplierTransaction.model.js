import mongoose from "mongoose";
import { formatGMTm3 } from "./utils.js";

const supplierTransactionSchema = new mongoose.Schema({
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
    purchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "purchases",
        default: null,
    },
});

export default mongoose.model(
    "supplier_transactions",
    supplierTransactionSchema
);
