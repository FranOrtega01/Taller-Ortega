import { Router } from "express";
import {
    get,
    getByID,
    create,
    update,
    deleteOne,
    createAmp,
    updateAmp,
    deleteAmp,
} from "../controller/jobs.controller.js";

const router = Router();

router.get("/", get);
router.get("/:id", getByID);
router.post("/", create);
router.post("/job/:id/amp", createAmp);
router.put("/:id", update);
router.put("/job/:jid/amp/:ampid", updateAmp);
router.delete("/:id", deleteOne);
router.delete("/job/:jid/amp/:ampid", deleteAmp);

export default router;
