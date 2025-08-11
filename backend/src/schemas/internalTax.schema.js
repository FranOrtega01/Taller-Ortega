import { z } from "zod";

// Subschema para impuestos internos
export const InternalTaxItem = z.object({
    concept: z.string().trim().min(1, "El concepto es requerido").optional(),
    amount: z.coerce
        .number({
            required_error: "El Monto de impuesto es requerido",
            invalid_type_error: "El Monto de impuesto debe ser numérico",
        })
        .min(0, "El Monto de impuesto no puede ser negativo"),
});
