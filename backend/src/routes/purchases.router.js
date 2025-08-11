import { Router } from "express";
import {
    get,
    create,
    update,
    getByID,
    deleteOne,
} from "../controller/purchases.controller.js";
import { postPurchaseSchema } from "../schemas/purchase.schema.js";
import { validate } from "../middlewares/validate.js";
const router = Router();

router.get("/", get);

router.get("/:id", getByID);

router.post("/", validate({ body: postPurchaseSchema }), create);

router.put("/:id", update);

router.delete("/:id", deleteOne);

export default router;
