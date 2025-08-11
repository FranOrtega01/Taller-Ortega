import { z } from "zod";
import { CURRENCY_MAP_CODES } from "../DAO/mongo/models/utils.js";

export const CurrencySchema = z
    .object({
        code: z.enum(CURRENCY_MAP_CODES)
    })
    .optional();
