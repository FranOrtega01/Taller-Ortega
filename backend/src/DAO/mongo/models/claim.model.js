import mongoose from "mongoose";
import {
    formatGMTm3,
    CLAIM_STATUS_CODES,
    workPanelsSchema,
    partSchema,
    CLAIM_STATUS_ENUM,
    CLAIM_TYPE_CODES,
    CLAIM_TYPE_ENUM,
} from "./utils.js";

const claimSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: CLAIM_STATUS_CODES,
        default: CLAIM_STATUS_ENUM.PENDING.code,
    },

    number: {
        type: String,
        required: [
            function () {
                return this.status !== CLAIM_STATUS_ENUM.PENDING.code && this.type === CLAIM_TYPE_ENUM.MAIN.code;
            },
            "El Número de Siniestro es requerido.",
        ],
    },
    date: {
        type: Date,
        default: () => formatGMTm3(new Date()),
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
        required: [
            function () {
                return this.status !== CLAIM_STATUS_ENUM.PENDING.code && this.type === CLAIM_TYPE_ENUM.MAIN.code;
            },
            "La Compañía es requerida",
        ],
    },
    amount: {
        type: Number,
        required: [
            function () {
                return this.status !== CLAIM_STATUS_ENUM.PENDING.code;
            },
            "El Monto es requerido",
        ],
    },
    iva: {
        type: Number,
        required: [
            function () {
                return this.status !== CLAIM_STATUS_ENUM.PENDING.code;
            },
            "El IVA es requerido",
        ],
    },
    deductible: {
        type: Number,
        required: [
            function () {
                return this.status !== CLAIM_STATUS_ENUM.PENDING.code;
            },
            "La Franquicia es requerida",
        ],
    },
    thumbnails: {
        type: [String],
        default: [],
    },
    type: {
        type: String,
        enum: CLAIM_TYPE_CODES,
        default: CLAIM_TYPE_ENUM.MAIN.code,
    },
    workPanels: {
        type: workPanelsSchema,
    },
    parentClaim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "claims",
        default: null, // Solo si es amp
        validate: {
            validator: async function (parentId) {
                // MAIN nunca debe tener parentClaim
                if (this.type === "MAIN") return !parentId;

                // AMP debe tener un parentClaim válido
                if (this.type === "AMP") {
                    if (!parentId) return false;

                    // Traer el siniestro padre
                    const parent = await mongoose
                        .model("claims")
                        .findById(parentId)
                        .select("type")
                        .lean();

                    // Debe existir y ser MAIN
                    return parent && parent.type === "MAIN";
                }

                return true;
            },
            message:
                "Las ampliaciones deben tener un siniestro principal válido. Los principales no deben tener uno.",
        },
    },
    replacesClaim: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "claims",
        default: null, // solo si reemplaza a otro siniestro
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobs",
        required: [true, "El Siniestro debe estar asociado a un Trabajo"],
    },
    parts: {
        type: [partSchema],
        default: [],
    },
});

export default mongoose.model("claims", claimSchema);
