import mongoose from "mongoose";

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
                const exists = await this.constructor.findOne({ cuit: value });
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
                const exists = await this.constructor.findOne({
                    name: value,
                });
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
                const exists = await this.constructor.findOne({
                    fiscalName: value,
                });
                return !exists;
            },
            message: "Ya hay una compañía con esta Razón Social.",
        },
    },

    fiscalAdress: {
        type: {
            adress: { type: String },
            city: { type: String },
            province: { type: String }
        },
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
        type: [String],
        default: []
    }
});

export default mongoose.model("companies", companySchema);
