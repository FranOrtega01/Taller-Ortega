import { JobDTO } from "../DAO/DTO/job.dto.js";
import { InvoiceDTO } from "../DAO/DTO/invoice.dto.js";
import {
    JobService,
    VehicleService,
    CompanyService,
    ClaimService,
    EstimateService,
} from "../repository/index.js";
import {
    SuccessResponse,
    ErrorResponse,
    formatLicensePlate,
    validateFilters,
    validateRequiredFields,
} from "./customResponse.js";
import mongoose from "mongoose";
import {
    CLAIM_STATUS_ENUM,
    JOB_STATUS_ENUM,
    PART_STATUS_ENUM,
} from "../DAO/mongo/models/utils.js";
import moment from "moment";
import { ClaimDTO } from "../DAO/DTO/claim.dto.js";

export const get = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || null;

        const filters = {};

        if (req.query.cuit) filters.cuit = req.query.cuit;
        if (req.query.isParticular)
            filters.isParticular = req.query.isParticular;
        if (req.query.status) filters.status = req.query.status;

        if (req.query.ownerName) filters.ownerName = req.query.ownerName;
        if (req.query.ownerLastname)
            filters.ownerLastname = req.query.ownerLastname;
        if (req.query.model) filters.model = req.query.model;
        if (req.query.licensePlate)
            filters.licensePlate = req.query.licensePlate;
        if (req.query.brand) filters.brand = req.query.brand;
        if (req.query.dateFrom) {
            filters.dateFrom = moment(req.query.dateFrom).toDate();
        }
        if (req.query.dateTo) {
            filters.dateTo = moment(req.query.dateTo).toDate();
        }

        const rawData = await JobService.get(page, limit, filters);

        const data = rawData.data.map((job) => new JobDTO(job).jobGeneral());
        return SuccessResponse(res, { ...rawData, data });
    } catch (error) {
        ErrorResponse(res, error);
    }
};

export const getByID = async (req, res) => {
    try {
        const job = await JobService.getByID(req.params.id);
        if (!job.isParticular) {
            const mainClaim = job?.claims?.[0];
            if (mainClaim) {
                const allAmps = await ClaimService.getAmpsByParent(
                    mainClaim._id
                );
                if (allAmps?.length > 0) {
                    job.claims.push(...allAmps);
                }
            }
        }

        const formattedJob = new JobDTO(job).jobDetail();
        return SuccessResponse(res, formattedJob);
    } catch (error) {
        if (
            error.message === "Trabajo no encontrado" ||
            error?.errorMessages?.[0] === "Trabajo no encontrado"
        ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const getByClient = async (req, res) => {
    try {
        const jobs = await JobService.getByClient(req.params.id);

        const formattedJobs = jobs.map((job) =>
            new JobDTO(job).jobsFromClient()
        );

        return SuccessResponse(res, formattedJobs);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getAllInvoicesForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await JobService.getByID(jobId);
        console.log("JOB IN INVOICES: ", job);
        const allClaims = await ClaimService.getAllClaimsForJob(jobId);
        console.log("ALL CLAIMS: ", allClaims);

        const invoices = [];

        // 1. Facturas directas del trabajo
        job.associatedInvoices?.forEach((inv) => {
            invoices.push({ ...inv, origin: "job", jobId: job._id });
        });

        // 2. Facturas desde claims

        allClaims?.forEach((claim) => {
            claim.associatedInvoices?.forEach((inv) => {
                invoices.push({
                    ...inv,
                    origin: "claim",
                    claimId: claim._id,
                });
            });
        });

        const formattedInvoices = invoices.map((inv) =>
            new InvoiceDTO(inv).invoiceGeneral()
        );
        return SuccessResponse(res, formattedInvoices);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getAllClaimsForJob = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return ErrorResponse(res, "El ID del Trabajo es requerido", 400);

        const job = await JobService.getByID(id);
        if (!job) return ErrorResponse(res, "Trabajo no encontrado", 404);

        const claims = await ClaimService.getAllClaimsForJob(id);
        const formattedClaims = claims?.map((c) =>
            new ClaimDTO(c).claimDetail()
        );

        return SuccessResponse(res, formattedClaims);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getJobsStatuses = async (req, res) => {
    try {
        const statusesArray = Object.keys(JOB_STATUS_ENUM)?.map((st) => ({
            code: JOB_STATUS_ENUM[st].code,
            name: JOB_STATUS_ENUM[st].name,
        }));
        return SuccessResponse(res, statusesArray);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getPartsStatuses = async (req, res) => {
    try {
        const statusesArray = Object.keys(PART_STATUS_ENUM)?.map((st) => ({
            code: PART_STATUS_ENUM[st].code,
            name: PART_STATUS_ENUM[st].name,
        }));
        return SuccessResponse(res, statusesArray);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const create = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Trabajo debe tener información", 400);

    const session = await mongoose.startSession();
    try {
        // Start Session in case of rollback @Fran
        session.startTransaction();
        // ---------------------------------------

        const { licensePlate, isParticular } = req.body;
        if (!licensePlate)
            return ErrorResponse(res, "La Patente es requerida", 400);
        if (!req.body?.company && !isParticular)
            return ErrorResponse(res, "El Compañía es requerida", 400);
        if (
            req.body.hasOrder &&
            !(
                req.body?.company?.claims?.claimDate ||
                req.body?.company?.claims?.claimNumber ||
                req.body?.company?.claims?.claimAmount ||
                req.body?.company?.claims?.claimDeductible ||
                req.body?.company?.claims?.claimInsured
            )
        ) {
            return ErrorResponse(res, "El Siniestro está incompleto", 400);
        }

        // Validate Vehicle
        let vehicle;
        try {
            vehicle = await VehicleService.getByLicense(
                formatLicensePlate(licensePlate),
                {
                    session,
                }
            );
        } catch (error) {
            vehicle = null;
        }
        if (!vehicle) return ErrorResponse(res, "Vehículo no encontrado", 400);

        // Validate Company
        let company;
        if (!isParticular) {
            try {
                company = await CompanyService.getByCUIT(
                    req.body?.company?.company,
                    {
                        session,
                    }
                );
            } catch (error) {
                company = null;
            }
            if (!company)
                return ErrorResponse(res, "Compañía no encontrada", 400);
        }

        // Estimate Logic
        let estimate_id = null;
        if (req.body?.estimate) {
            const { creationDate, price, thumbnails, status, payments } =
                req.body.estimate;

            const estimateData = {
                creationDate,
                price,
                thumbnails,
                status,
                payments,
            };
            const newEstimate = await EstimateService.create(estimateData, {
                session,
            });
            estimate_id = newEstimate._id;
        }

        const jobData = {
            vehicle: vehicle._id,
            company: company?._id || null,
            date: req?.body?.date,
            entryDate: req?.body?.entryDate,
            description: req?.body?.description,
            observations: req?.body?.observations,
            amount: req?.body?.amount,
            workPanels: req?.body?.workPanels,
            parts: req?.body?.parts,
            thumbnails: req?.body?.thumbnails,
            isParticular,
            estimate: estimate_id,
            status:
                req?.body?.entryDate && req?.body?.amount > 0
                    ? JOB_STATUS_ENUM.IN_PROGRESS.code
                    : JOB_STATUS_ENUM.PENDING.code,
        };

        // Create Job
        const job = await JobService.create(jobData, { session });

        // Insert JobId in Estimate
        await EstimateService.update(
            estimate_id,
            { job: job._id },
            { session }
        );

        // If by company, create Root ("MAIN") Claim
        if (!isParticular) {
            const claimData = {
                company: company._id,
                job: job._id,
                type: "MAIN",
            };
            if (req.body.company.hasOrder) {
                claimData.status = CLAIM_STATUS_ENUM.ACTIVE.code;
                claimData.number = req.body.company.claims.claimNumber;
                claimData.date = req.body.company.claims.claimDate;
                claimData.amount = req.body.company.claims.claimAmount;
                claimData.deductible = req.body.company.claims.claimDeductible;
                claimData.insured = req.body.company.claims.claimInsured;
            }
            // Set Status if Active

            // Create Claim
            const claim = await ClaimService.create(claimData, { session });

            // Insert Claim in Job
            await JobService.update(
                job._id,
                { claims: [claim._id] },
                { session }
            );
        }

        // Commit Transaction
        await session.commitTransaction();
        session.endSession();
        SuccessResponse(res, { code: job._id });
    } catch (error) {
        // If error, abort transaction
        console.log("ABORTED");
        await session.abortTransaction();
        session.endSession();
        ErrorResponse(res, error);
    }
};

export const update = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Trabajo debe tener información", 400);
    try {
        const { id } = req.params;
        if (req?.body?._id) delete req?.body?._id;

        const job = await JobService.update(id, req.body);
        SuccessResponse(res, job);
    } catch (error) {
        ErrorResponse(res, error);
    }
};

export const updateGeneralInfo = async (req, res) => {
     try {
        const { id } = req.params;
        if (req?.body?._id) delete req?.body?._id;
        const payload = {
            entryDate: req?.body?.entryDate,
            amount: req?.body?.amount,
            workPanels: req?.body?.workPanels
        }

        const job = await JobService.update(id, payload);
        SuccessResponse(res, job);
    } catch (error) {
        ErrorResponse(res, error);
    }
}

export const updateParts = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Trabajo debe tener información", 400);
    if (!req.body.parts)
        return ErrorResponse(res, "Los Repuestos deben tener información", 400);
    try {
        const { id } = req.params;
        const { parts } = req.body;

        const response = await JobService.updateParts(id, parts);
        console.log("UPDATE: ", response);

        return SuccessResponse(res, {}, 204);
    } catch (error) {
        ErrorResponse(res, error);
    }
};

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const job = await JobService.delete(id);
    SuccessResponse(res, job);
};

export const createAmp = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "La Ampliación debe tener información", 400);
    try {
        const { id } = req.params;
        const { date, description, observations, amount, workPanels } =
            req.body;

        const rawData = {
            date,
            description,
            observations,
            amount,
            workPanels,
        };
        const ampData = Object.fromEntries(
            Object.entries(rawData).filter(([_, value]) => value !== undefined)
        );

        const amp = await JobService.createAmp(id, ampData);
        SuccessResponse(res, amp);
    } catch (error) {
        ErrorResponse(res, error);
    }
};

export const updateAmp = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "La Ampliación debe tener información", 400);
    try {
        const { jid, ampid } = req.params;
        if (!jid)
            return ErrorResponse(res, "El ID del Trabajo es requerido", 400);
        if (!ampid)
            return ErrorResponse(
                res,
                "El ID de la Ampliación es requerido",
                400
            );

        const { date, description, observations, amount, workPanels, parts } =
            req.body;

        const rawData = {
            date,
            description,
            observations,
            amount,
            workPanels,
            parts,
        };

        const ampData = Object.fromEntries(
            Object.entries(rawData).filter(([_, value]) => value !== undefined)
        );
        const job = await JobService.updateAmp(jid, ampid, ampData);
        SuccessResponse(res, job);
    } catch (error) {
        ErrorResponse(res, error);
    }
};

export const deleteAmp = async (req, res) => {
    const { jid, ampid } = req.params;
    if (!jid) return ErrorResponse(res, "El ID del Trabajo es requerido", 400);
    if (!ampid)
        return ErrorResponse(res, "El ID de la Ampliación es requerido", 400);

    try {
        const job = await JobService.deleteAmp(jid, ampid);
        SuccessResponse(res, job);
    } catch (error) {
        ErrorResponse(res, error);
    }
};

// PENDING to IN_PROGRESS (fields required);
export const activateJob = async (req, res) => {
    const { id } = req.params;
    if (!id) return ErrorResponse(res, "El ID del Trabajo es requerido", 400);

    try {
        const data = Object.fromEntries(
            Object.entries({
                claims: req.body.claims,
                entryDate: req.body.entryDate,
                description: req.body.description,
                estimate: req.body.estimate,
                amount: req.body.amount,
                workPanels: req.body.workPanels,
                parts: req.body.parts,
                status: JOB_STATUS_ENUM.IN_PROGRESS.code,
            }).filter(([_, value]) => value !== undefined && value !== null)
        );

        const active = await JobService.activateJob(id, data);
        return SuccessResponse(res, active, 200);
    } catch (e) {
        ErrorResponse(res, e);
    }
};

export const completeJob = async (req, res) => {
    const { id } = req.params;
    if (!id) return ErrorResponse(res, "El ID del Trabajo es requerido", 400);

    try {
        const job = await JobService.getByID(id);

        if (job.status !== JOB_STATUS_ENUM.IN_PROGRESS.code) {
            throw new Error(
                `El trabajo no está ${JOB_STATUS_ENUM.IN_PROGRESS.name}`
            );
        }

        const allClaims = await ClaimService.getAllClaimsForJob(id);

        let allInvoices = true;
        if (job?.associatedInvoices?.length < 1 && job?.isParticular) allInvoices = false;

        // 2. Facturas desde claims
        console.log("ALL CLAIMS: ", allClaims);

        allClaims?.forEach((claim) => {
            if (claim?.associatedInvoices?.length < 1) allInvoices = false;
        });

        if (!allInvoices) {
            throw new Error(
                "El trabajo no tiene todos los comprobantes cargados"
            );
        }

        const data = Object.fromEntries(
            Object.entries({
                status: JOB_STATUS_ENUM.COMPLETED.code,
            }).filter(([_, value]) => value !== undefined && value !== null)
        );

        const active = await JobService.completeJob(id, data);
        return SuccessResponse(res, active, 200);
    } catch (e) {
        ErrorResponse(res, e);
    }
};
