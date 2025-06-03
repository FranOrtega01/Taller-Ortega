import mongoose from "mongoose";
import {
    INVOICE_TYPE_CODES,
    INVOICE_STATUS_CODES,
    INVOICE_STATUS_ENUM,
} from "./utils.js";

const invoiceSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: INVOICE_STATUS_CODES,
        default: INVOICE_STATUS_ENUM.ISSUED.code,
    },
    code: {
        type: String,
        enum: INVOICE_TYPE_CODES,
        required: [true, "El Tipo de Comprobante es obligatorio"],
    },
    number: {
        type: String,
        unique: [true, "El Comprobante debe ser único"],
        required: [true, "El Numero de Comprobante es obligatorio"],
    },
    posNumber: {
        type: String,
        required: [true, "El Punto de Venta es obligatorio"],
    },
    issueDate: {
        type: Date,
        required: [true, "La Fecha de Emisión es obligatoria"],
    },
    caeNumber: {
        type: String,
        required: [true, "El Número CAE es obligatorio"],
    },
    caeDate: {
        type: Date,
        required: [true, "La Fecha CAE es obligatoria"],
    },
    description: {
        type: String,
        required: [true, "La Desripción es obligatoria"],
    },
    cuit: {
        type: String,
        required: [true, "El CUIT es obligatorio"],
    },
    fiscalName: {
        type: String,
        required: [true, "La Razón Social es obligatoria."],
    },
    amount: {
        type: Number,
        required: [true, "EL Precio Unitario es obligatorio"],
    },
    iva: {
        type: Number,
        required: [true, "El IVA es obligatorio"],
    },
    payments: {
        type: [
            {
                date: {
                    type: Date,
                    required: [true, "La Fecha del pago es obligatoria"],
                },
                amount: {
                    type: Number,
                    required: [true, "El Monto es obligatorio"],
                },
                method: {
                    type: String,
                    required: [true, "El Método de pago es obligatorio"],
                },
            },
        ],
        default: [],
    },
    canceledInvoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "invoices",
        default: null,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobs",
        default: null,
    },
    claim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "claims",
        default: null,
    },
});

export default mongoose.model("invoices", invoiceSchema);
