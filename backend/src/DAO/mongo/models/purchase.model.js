import mongoose from "mongoose";
import { addIVA, formatGMTm3 } from "./utils.js";

const purchaseSchema = new mongoose.Schema(
    {
        supplierCUIT: {
            type: String,
            required: [true, "El CUIT es obligatorio."],
            match: [/^\d{11}$/, "El CUIT debe tener 11 dígitos"],
        },
        date: {
            type: Date,
            default: () => formatGMTm3(new Date()),
        },
        concept: { type: String, required: [true, "El Concepto es requerido"] },
        netAmount21: {
            type: Number,
            required: [true, "El Precio neto gravado es requerido."],
            default: 0,
        },
        netAmount10: {
            type: Number,
            required: [true, "El Precio neto gravado es requerido."],
            default: 0,
        },
        iibb: {
            type: Number,
            required: [true, "Los Ingresos Brutos son requeridos."],
            default: 0,
        },
        internalTaxes: {
            type: [
                {
                    concept: String,
                    amount: {
                        type: Number,
                        required: [true, "El Monto de impuesto es requerido"],
                    },
                },
            ],
            default: [],
        },
        total: {
            type: Number,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

purchaseSchema.virtual("iva21").get(function () {
    return parseFloat((this.netAmount21 * 0.21).toFixed(2));
});

purchaseSchema.virtual("iva10").get(function () {
    return parseFloat((this.netAmount10 * 0.105).toFixed(2));
});

purchaseSchema.pre("save", function (next) {
    const taxesSum = this.internalTaxes.reduce(
        (sum, tax) => sum + tax.amount,
        0
    );
    const total = parseFloat(
        (
            addIVA(this.netAmount21, 21) +
            addIVA(this.netAmount10, 10.5) +
            this.iibb +
            taxesSum
        ).toFixed(2)
    );
    console.log(total);

    this.total = total;
    next();
});

export default mongoose.model("purchases", purchaseSchema);
