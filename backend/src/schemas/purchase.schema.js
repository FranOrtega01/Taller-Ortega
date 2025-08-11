import { z } from "zod";
import { isValidCUIT } from "../utils.js";
import { InternalTaxItem } from "./internalTax.schema.js";

const round2 = (n) => Math.round(n * 100) / 100;

// POST (Create)
export const postPurchaseSchema = z
    .object({
        supplierCUIT: z
            .string({
                required_error: "El CUIT es obligatorio.",
                invalid_type_error: "El CUIT debe ser una cadena",
            })
            .regex(/^\d{11}$/, "El CUIT debe tener 11 dígitos"),
        // .refine(isValidCUIT, "El CUIT no supera la validación del dígito verificador")
        date: z.coerce.date().optional(),

        concept: z
            .string({ required_error: "El Concepto es requerido" })
            .trim()
            .min(1, "El Concepto es requerido"),

        netAmount21: z.coerce
            .number({ invalid_type_error: "Debe ser numérico" })
            .min(0, "No puede ser negativo")
            .transform(round2)
            .default(0),

        netAmount10: z.coerce
            .number({ invalid_type_error: "Debe ser numérico" })
            .min(0, "No puede ser negativo")
            .transform(round2)
            .default(0),

        iibb: z.coerce
            .number({ invalid_type_error: "Debe ser numérico" })
            .min(0, "No puede ser negativo")
            .transform(round2)
            .default(0),

        internalTaxes: z
            .array(
                InternalTaxItem.extend({
                    amount: InternalTaxItem.shape.amount.transform(round2),
                })
            )
            .default([]),

        total: z.never().optional(),
        _id: z.never().optional(),
    })
    .strict()
    .refine((d) => d.netAmount21 > 0 || d.netAmount10 > 0, {
        message:
            "El Monto es obligatorio (al menos uno de netAmount21 o netAmount10 debe ser mayor a 0).",
    });
