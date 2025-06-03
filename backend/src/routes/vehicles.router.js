import { Router } from "express";
import {
    get,
    getByLicense,
    create,
    update,
    deleteOne,
    getClientByLicensePlate
} from "../controller/vehicles.controller.js";

const router = Router();

router.get("/vehicles", get);

router.get("/vehicle/:license", getByLicense);

router.get('/vehicle/:license/owner', getClientByLicensePlate)

router.post("/vehicle", create);

router.put("/:license", update);

router.delete("/:id", deleteOne);

export default router;
