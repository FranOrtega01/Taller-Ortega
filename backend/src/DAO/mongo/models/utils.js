import mongoose from "mongoose";

// ====================================== Enums =======================================
// -> Estimate
export const ESTIMATE_STATUS_ENUM = {
    PAID: { code: "PAID", name: "Pagado" },
    PENDING: { code: "PENDING", name: "Pendiente" },
    REJECTED: { code: "REJECTED", name: "Rechazado" },
    SENT: { code: "SENT", name: "Enviado" },
};
export const ESTIMATE_STATUS_CODES = Object.keys(ESTIMATE_STATUS_ENUM);

// -> Job Status
export const JOB_STATUS_ENUM = {
    PENDING: { code: "PENDING", name: "Pendiente" },
    IN_PROGRESS: { code: "IN_PROGRESS", name: "En progreso" },
    CANCELLED: { code: "CANCELLED", name: "Cancelado" },
    COMPLETED: { code: "COMPLETED", name: "Completado" },
    INVOICED: { code: "INVOICED", name: "Facturado" },
    INVOICE_PAID: { code: "INVOICE_PAID", name: "Pagado" },
};
export const JOB_STATUS_CODES = Object.keys(JOB_STATUS_ENUM);

// -> Part Status
export const PART_STATUS_ENUM = {
    PENDING: { code: "PENDING", name: "Pendiente" },
    REJECTED: { code: "REJECTED", name: "Rechazado" },
    WAITING: { code: "WAITING", name: "Esperando" },
    DELIVERING: { code: "DELIVERING", name: "En camino" },
    DELIVERED: { code: "DELIVERED", name: "Aceptado" },
};
export const PART_STATUS_CODES = Object.keys(PART_STATUS_ENUM);

// -> Claim Status
export const CLAIM_STATUS_ENUM = {
    PENDING: { code: "PENDING", name: "Pendiente" },
    ACTIVE: { code: "ACTIVE", name: "Activo" },
    WAITING_AMP: { code: "WAITING_AMP", name: "Esperando ampliación" },
    CANCELLED: { code: "CANCELLED", name: "Cancelado" },
    INVOICED: { code: "INVOICED", name: "Facturado" },
};
export const CLAIM_STATUS_CODES = Object.keys(CLAIM_STATUS_ENUM);

// -> Claim Types
export const CLAIM_TYPE_ENUM = {
    MAIN: { code: "MAIN", name: "Original" },
    AMP: { code: "AMP", name: "Ampliación" },
};
export const CLAIM_TYPE_CODES = Object.keys(CLAIM_TYPE_ENUM);

// =================================== Sub Schemas ===================================
// -> Work Panel Item
const workItemSchema = new mongoose.Schema(
    {
        quantity: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
    },
    { _id: false }
);

// -> Work Panels
export const workPanelsSchema = new mongoose.Schema(
    {
        bodyWork: { type: workItemSchema },
        paintWork: { type: workItemSchema },
        glassWork: { type: workItemSchema },
        otherWork: { type: workItemSchema },
    },
    { _id: false }
);

// -> Parts
export const partSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: PART_STATUS_CODES,
            default: PART_STATUS_ENUM.PENDING.code,
        },
        name: {
            type: String,
            required: [true, "El Nombre del Repuesto es requerido"],
        },
        quantity: {
            type: Number,
            default: 1,
        },
        supplier: String,
        dateRequested: {
            type: Date,
            default: () => formatGMTm3(new Date()),
        },
        dateDelivered: Date,
        price: Number,
    },
    { _id: false }
);

// -> Observation
export const observationSchema = new mongoose.Schema({
    observation: String,
    date: {
        type: Date,
        default: () => formatGMTm3(new Date()),
    },
});

// -> Phone
export const phoneSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, "El Teléfono es requerido"],
    },
    name: {
        type: String,
        default: "",
    },
});

// -> Address
export const addressSchema = new mongoose.Schema({
    adress: { type: String },
    city: { type: String },
    province: { type: String },
});

// =================================== Functions ======================================

export function formatGMTm3(date) {
    if (!date) return null;
    return new Date(date.getTime() - 3 * 60 * 60 * 1000);
}

export function addIVA(netAmount, IVA) {
    return (netAmount * (100 + IVA)) / 100;
}
