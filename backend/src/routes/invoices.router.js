import { Router } from "express";
import {
    get,
    getByID,
    create,
    update,
    deleteOne,
    getStatuses,
    getTypes,
    setInvoicePayments
} from "../controller/invoices.controller.js";

const router = Router();

router.get("/invoices", get);

router.get("/invoice/:id", getByID);

router.get("/invoices/invoice-statuses", getStatuses);

router.get("/invoices/invoice-types", getTypes);

router.post("/invoice", create);

router.post("/invoice/:id/payments", setInvoicePayments)

router.put("/invoice/:id", update);

router.delete("/invoice/:id", deleteOne);

export default router;
