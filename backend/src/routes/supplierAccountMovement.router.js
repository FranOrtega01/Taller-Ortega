import { Router } from "express";
import {
    get,
    create,
    update,
    getByID,
    deleteOne,
    createSupplierPayment,
    getBySupplier
} from "../controller/supplierAccountMovements.controller.js";

import { validate } from "../middlewares/validate.js";
import {
    postSupplierPaymentSchema,
    supplierParamSchema,
} from "../schemas/supplierAccountMovement.schema.js";

const router = Router();

router.get("/movements", get);

router.get(
    "/movement/:id",
    validate({
        params: supplierParamSchema,
    }),
    getByID
);

router.get(
    "/movements/supplier/:id",
    validate({
        params: supplierParamSchema,
    }),
    getBySupplier
);

router.post("/movement", create);

router.post(
    "/supplier/:id/payment",
    validate({
        params: supplierParamSchema,
        body: postSupplierPaymentSchema,
    }),
    createSupplierPayment
);

router.put("/movement/:id", update);

router.delete("/:id", deleteOne);

export default router;
