import { z } from "zod";
import { JOB_STATUS_CODES } from "../DAO/mongo/models/utils.js";

export const getJobsQuery = z
    .object({
        cuit: z
            .string()
            .regex(/^\d{11}$/)
            .optional(),
        isParticular: z.coerce.boolean().optional(),
        status: z.enum(JOB_STATUS_CODES).optional(),
        ownerName: z.string().trim().max(80).optional(),
        ownerLastname: z.string().trim().max(80).optional(),
        model: z.string().trim().max(80).optional(),
        licensePlate: z.string().trim().max(10).optional(),
        brand: z.string().trim().max(60).optional(),
        dateFrom: z.coerce.date().optional(),
        dateTo: z.coerce.date().optional(),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).nullable().optional(),
    })
    .strict();
