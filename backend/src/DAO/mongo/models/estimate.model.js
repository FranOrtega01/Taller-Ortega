import mongoose from "mongoose";
import { ESTIMATE_STATUS_ENUM,ESTIMATE_STATUS_CODES, formatGMTm3 } from "./utils.js";

const estimateSchema = new mongoose.Schema({
    creationDate: {
        type: Date,
        default: () => formatGMTm3(new Date()),
    },
    price: {
        type: Number,
        required: [true, "El precio es requerido."],
    },
    thumbnails: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ESTIMATE_STATUS_CODES,
        default: ESTIMATE_STATUS_ENUM.PENDING.code,
    },
    payments: {
        type: [
            {
                date: Date,
                amount: Number,
                method: String,
            },
        ],
        default: [],
    },
});

estimateSchema.set("toJSON", {
    transform: function (doc, ret) {
        if (ret.status) {
            ret.status = ESTIMATE_STATUS_ENUM[ret.status] || {
                code: ret.status,
                name: "",
            };
        }
        return ret;
    },
});

export default mongoose.model("estimates", estimateSchema);
