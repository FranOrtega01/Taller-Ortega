import { Router } from "express";
import {
    get,
    create,
    getByID,
    updateActiveClaim,
    deleteOne,
    activateClaim,
    createClaimAmp,
} from "../controller/claims.controller.js";

const router = Router();

router.get("/claims", get);
router.post("/claim", create);
router.get("/claim/:id", getByID);
router.put("/claim/:id", updateActiveClaim);
router.delete("/claim/:id", deleteOne);
router.put("/claim/:id/activate", activateClaim);
router.post("/claim/:parentId/amp", createClaimAmp);

export default router;
