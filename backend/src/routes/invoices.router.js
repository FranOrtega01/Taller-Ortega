import { Router } from "express";
import {
    get,
    getByID,
    create,
    update,
    deleteOne,
    getStatuses,
    getTypes,
} from "../controller/invoices.controller.js";

const router = Router();

router.get("/invoices", get);

router.get("/invoice/:id", getByID);

router.get("/invoices/invoice-statuses", getStatuses);

router.get("/invoices/invoice-types", getTypes);

router.post("/", create);

router.put("/:id", update);

router.delete("/:id", deleteOne);

export default router;
