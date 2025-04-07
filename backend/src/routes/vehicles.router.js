import { Router } from "express";
import {
    get,
    getByLicense,
    create,
    update,
    deleteOne
} from "../controller/vehicles.controller.js";

const router = Router();

router.get("/", get);

router.get("/:license", getByLicense);

router.post("/", create);

router.put("/:license", update);

router.delete("/:id", deleteOne);

export default router;
