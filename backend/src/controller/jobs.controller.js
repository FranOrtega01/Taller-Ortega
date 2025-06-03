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
} from "./customResponse.js";
import mongoose from "mongoose";
import {
    JOB_STATUS_ENUM,
    PART_STATUS_ENUM,
} from "../DAO/mongo/models/utils.js";
import moment from "moment";

export const get = async (req, res) => {
    try {
        const allowedFilters = [
            "cuit",
            "isParticular",
            "status",
            "owner",
            "model",
            "licensePlate",
            "brand",
            "dateFrom", // "YYYY-MM-DD"
            "dateTo", // "YYYY-MM-DD"
            "page",
            "limit",
        ];

        const invalid = validateFilters(req.query, allowedFilters, res);
        if (invalid.length > 0) {
            return ErrorResponse(
                res,
                `Filtros inválidos: ${invalid.join(", ")}`,
                400
            );
        }

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

        console.log("Filters: ", filters);

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
        console.log("Job: ", job);

        const invoices = [];

        // 1. Facturas directas del trabajo
        job.associatedInvoices?.forEach((inv) => {
            invoices.push({ ...inv, origin: "job", jobId: job._id });
        });

        // 2. Facturas desde claims
        job.claims?.forEach((claim) => {
            claim.associatedInvoices?.forEach((inv) => {
                invoices.push({
                    ...inv,
                    origin: "claim",
                    claimId: claim._id,
                });
            });

            // 3. Amps del claim con facturas (si las hay)
            claim.amps?.forEach((amp, index) => {
                amp.associatedInvoices?.forEach((inv) => {
                    invoices.push({
                        ...inv,
                        origin: "claimAmp",
                        claimId: claim._id,
                        ampIndex: index,
                    });
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
            return ErrorResponse(res, "El Compañía es requerido", 400);

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
                company = await CompanyService.getByCUIT(req.body?.company, {
                    session,
                });
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
            description: req?.body?.description,
            observations: req?.body?.observations,
            amount: req?.body?.amount,
            iva: req?.body?.iva,
            workPanels: req?.body?.workPanels,
            parts: req?.body?.parts,
            thumbnails: req?.body?.thumbnails,
            isParticular,
            estimate: estimate_id,
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
            console.log("claimData: ", claimData);
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
