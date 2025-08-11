import { z } from "zod";

export const ObjectIdString = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ObjectId inválido");

export const supplierParamsSchema = z
    .object({
        supplierId: ObjectIdString,
    })
    .strict();

export const ledgerQuerySchema = z
    .object({
        year: z.coerce.number().int().min(1970).max(2100),
        month: z.coerce.number().int().min(1).max(12),
    })
    .strict();
