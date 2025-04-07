import { Router } from "express";
import { get, create, getByID, updateActiveClaim, deleteOne, activateClaim, createClaimAmp } from "../controller/claims.controller.js";

const router = Router();

router.get("/", get);
router.post("/", create);
router.get("/:id", getByID);
router.put("/:id", updateActiveClaim);
router.delete("/:id", deleteOne);
router.put("/:id/activate", activateClaim);
router.post("/:parentId/amp", createClaimAmp);

export default router;
