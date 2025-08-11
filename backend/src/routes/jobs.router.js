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
    getByClient,
    getPartsStatuses,
    updateParts,
    getAllInvoicesForJob,
    getJobsStatuses,
    activateJob,
    completeJob,
    getAllClaimsForJob,
    updateGeneralInfo,
} from "../controller/jobs.controller.js";

import { validate } from '../middlewares/validate.js';
import { getJobsQuery } from "../schemas/job.schema.js";

const router = Router();

router.get("/jobs", validate({ query: getJobsQuery }), get);
router.get("/job/:id", getByID);
router.get("/client/:id", getByClient);
router.get("/parts/statuses", getPartsStatuses);
router.get("/jobs/statuses", getJobsStatuses);
router.get("/job/:id/claims", getAllClaimsForJob);
router.get("/job/invoices/:jobId", getAllInvoicesForJob);
router.post("/job", create);
router.post("/job/:id/activate", activateJob);
router.post("/job/:id/complete", completeJob);
router.post("/job/:id/amp", createAmp);
router.put("/job/:id/general", updateGeneralInfo);
router.put("/job/:id", update);
router.put("/job/:id/parts", updateParts);
router.put("/job/:jid/amp/:ampid", updateAmp);
router.delete("/:id", deleteOne);
router.delete("/job/:jid/amp/:ampid", deleteAmp);

export default router;
