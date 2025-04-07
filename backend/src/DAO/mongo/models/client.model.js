import mongoose from "mongoose";
import { observationSchema, phoneSchema, addressSchema } from "./utils.js";

const clientSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: [true, "Ya hay un cliente con ese DNI"],
        required: [true, "La Identificación es obligatoria"],
        match: [/^\d+$/, "La Identificación debe contener solo números."],
    },

    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    lastname: {
        type: String,
        default: "",
    },
    adress: {
        type: addressSchema,
        default: null,
    },

    phones: {
        type: [phoneSchema],
        default: [],
    },
    emails: {
        type: [String],
        default: [],
    },
    observations: {
        type: [observationSchema],
        default: [],
    },
});

export default mongoose.model("clients", clientSchema);