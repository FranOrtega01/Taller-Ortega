import mongoose from "mongoose";
import { formatGMTm3, partSchema, workPanelsSchema, observationSchema, JOB_STATUS_CODES, JOB_STATUS_ENUM } from "./utils.js";

const jobSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicles",
        required: true,
    },
    claims: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "claims" }],
        default: [],
    },
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
    estimate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "estimates",
        default: null,
    },
    amount: {
        type: Number,
        default: 0,
    },
    iva: {
        type: Number,
        enum: [0, 21],
        default: 0,
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
    }
});

export default mongoose.model("jobs", jobSchema);
