import mongoose from "mongoose";
import { addressSchema, phoneSchema } from "./utils.js";
const supplierSchema = new mongoose.Schema({
    cuit: {
        type: String,
        unique: true,
        required: [true, "El CUIT es obligatorio."],
        match: [/^\d{11}$/, "El CUIT debe tener 11 dígitos"],
        validate: {
            validator: async function (value) {
                const filter = this.isNew
                    ? { cuit: value }
                    : { cuit: value, _id: { $ne: this.getQuery()._id } };

                const exists = await mongoose.models["suppliers"].findOne(
                    filter
                );
                return !exists;
            },
            message: "El CUIT ya está registrado.",
        },
    },
    name: {
        type: String,
        required: [true, "El Nombre es obligatorio."],
        unique: true,
        validate: {
            validator: async function (value) {
                const filter = this.isNew
                    ? { name: value }
                    : { name: value, _id: { $ne: this.getQuery()._id } };

                const exists = await mongoose.models["suppliers"].findOne(
                    filter
                );
                return !exists;
            },
            message: "Ya hay un Proveedor con este Nombre.",
        },
    },
    adress: {
        type: addressSchema,
        default: null,
    },
    emails: {
        type: [String],
        default: [],
    },
    phones: {
        type: [phoneSchema],
        default: [],
    },
});

export default mongoose.model("suppliers", supplierSchema);
