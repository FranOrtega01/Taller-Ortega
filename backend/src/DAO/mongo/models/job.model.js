import mongoose from "mongoose";
import {
    formatGMTm3,
    partSchema,
    workPanelsSchema,
    observationSchema,
    JOB_STATUS_CODES,
    JOB_STATUS_ENUM,
} from "./utils.js";

const jobSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicles",
        required: true,
    },
    claims: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "claims" }],
        required: [
            function () {
                return !this.isParticular;
            },
        ],
        default: [],
    },
    date: {
        type: Date,
        default: formatGMTm3(new Date()),
    },
    entryDate: {
        type: Date,
        default: null,
        required: [
            function () {
                return this.status !== JOB_STATUS_ENUM.PENDING.code;
            },
            "La fecha de ingreso es obligatoria"
        ],
    },
    description: {
        type: String,
        default: "",
    },
    observations: {
        type: [observationSchema],
        default: [],
    },
    estimate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "estimates",
        default: null,
        // required: [
        //     function () {
        //         return this.status !== JOB_STATUS_ENUM.PENDING.code;
        //     },
        // ],
    },
    amount: {
        type: Number,
        min: [1, "El monto debe ser mayor a 0"],
        required: [
            function () {
                return this.status !== JOB_STATUS_ENUM.PENDING.code;
            },
            "El monto es obligatorio"
        ],
    },
    isParticular: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: JOB_STATUS_CODES,
        default: JOB_STATUS_ENUM.PENDING.code,
    },
    workPanels: workPanelsSchema,
    parts: {
        type: [partSchema],
        default: [],
    },
    associatedInvoices: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "invoices",
        default: [],
    },
    amps: {
        type: [
            {
                date: {
                    type: Date,
                    default: formatGMTm3(new Date()),
                },
                description: {
                    type: String,
                    default: "",
                },
                observations: {
                    type: [observationSchema],
                    default: [],
                },
                amount: {
                    type: Number,
                    default: 0,
                },
                workPanels: workPanelsSchema,
                parts: {
                    type: [partSchema],
                    default: [],
                },
            },
        ],
        default: [],
    },
});

export default mongoose.model("jobs", jobSchema);
