import { z } from "zod";
import {
    SUPPLIER_ACCOUNT_MOVEMENT_METHOD_CODES,
    SUPPLIER_ACCOUNT_MOVEMENT_ORIGIN_CODES,
} from "../DAO/mongo/models/utils.js";
import { CurrencySchema } from "./currency.schema.js";

const ObjectIdString = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ObjectId inválido");

export const createSupplierAccountMovement = z
    .object({
        _id: z.never().optional(),
        supplier: ObjectIdString,
        date: z.coerce.date().optional(),
        concept: z.string().trim().min(1, "El Concepto es requerido"),
        credit: z.coerce
            .number()
            .min(0)
            .transform((n) => +n.toFixed(2))
            .default(0),
        debit: z.coerce
            .number()
            .min(0)
            .transform((n) => +n.toFixed(2))
            .default(0),
        currency: CurrencySchema,
        method: z
            .enum(SUPPLIER_ACCOUNT_MOVEMENT_METHOD_CODES)
            .nullable()
            .optional()
            .default(null),
        origin: z.enum(SUPPLIER_ACCOUNT_MOVEMENT_ORIGIN_CODES),
        referenceId: ObjectIdString.nullable().optional().default(null),
    })
    .strict()
    .superRefine((val, ctx) => {
        // XOR credit/debit (uno > 0, el otro == 0)
        const creditPos = val.credit > 0;
        const debitPos = val.debit > 0;
        if (creditPos === debitPos) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Debe ser crédito o débito (exclusivo).",
                path: ["credit"],
            });
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Debe ser crédito o débito (exclusivo).",
                path: ["debit"],
            });
        }

        // referenceId requerido si el origen es PURCHASE (ajustá si aplica a otros)
        if (
            (val.origin ===
                SUPPLIER_ACCOUNT_MOVEMENT_ORIGIN_CODES["PURCHASE"] &&
                !val.referenceId) ||
            (val.origin ===
                SUPPLIER_ACCOUNT_MOVEMENT_ORIGIN_CODES["THIRD_PARTY_PAYMENT"] &&
                !val.referenceId)
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "La referencia es obligatoria cuando es Compra o Pago de terceros",
                path: ["referenceId"],
            });
        }
    });

export const supplierParamSchema = z.object({
    id: ObjectIdString, 
});

export const postSupplierPaymentSchema = z.object({
    _id: z.never().optional(),
    date: z.coerce.date().optional(),
    credit: z.coerce
        .number()
        .min(1)
        .transform((n) => +n.toFixed(2)),
    currency: CurrencySchema,
    method: z
        .enum(SUPPLIER_ACCOUNT_MOVEMENT_METHOD_CODES)
        .nullable()
        .default(null),
}).strict();
