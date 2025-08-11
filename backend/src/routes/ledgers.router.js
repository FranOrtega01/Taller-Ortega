import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { supplierParamsSchema, ledgerQuerySchema } from "../schemas/ledger.schema.js";
import { getSupplierLedger } from "../controller/ledger.controller.js";

const router = Router();

router.get(
  "/suppliers/:supplierId/ledger",
  validate({ params: supplierParamsSchema, query: ledgerQuerySchema }),
  getSupplierLedger
);

export default router;
