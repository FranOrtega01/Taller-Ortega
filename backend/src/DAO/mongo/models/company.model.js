import mongoose from "mongoose";
import { phoneSchema, addressSchema } from "./utils.js";

const companySchema = new mongoose.Schema({
    cuit: {
        type: String,
        unique: true,
        required: [true, "El CUIT es obligatorio."],
        match: [
            /^\d{11}$/,
            "El CUIT debe tener 11 dígitos",
        ],
        validate: {
            validator: async function (value) {
                const filter = this.isNew 
                ? { cuit: value } 
                : { cuit: value, _id: { $ne: this.getQuery()._id } };

            const exists = await mongoose.models["companies"].findOne(filter);
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

                const exists = await mongoose.models["companies"].findOne(filter);
                return !exists;
            },
            message: "Ya hay una compañía con este Nombre.",
        },
    },
    fiscalName: {
        type: String,
        required: [true, "La Razón Social es obligatoria."],
        unique: true,
        validate: {
            validator: async function (value) {
                const filter = this.isNew 
                    ? { fiscalName: value } 
                    : { fiscalName: value, _id: { $ne: this.getQuery()._id } };

                const exists = await mongoose.models["companies"].findOne(filter);
                return !exists;
            },
            message: "Ya hay una compañía con esta Razón Social.",
        },
    },

    fiscalAdress: {
        type: {addressSchema},
        default: null 
    },

    hasPortal: {
        type: Boolean,
        default: false,
    },

    emails: {
        type: [String],
        default: [],
    },

    phones:{
        type: [phoneSchema],
        default: []
    }
});

export default mongoose.model("companies", companySchema);
