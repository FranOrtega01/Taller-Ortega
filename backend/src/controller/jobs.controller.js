import {
    JobService,
    VehicleService,
    CompanyService,
    ClaimService,
} from "../repository/index.js";
import { SuccessResponse, ErrorResponse, formatLicensePlate } from "./customResponse.js";
import mongoose from "mongoose";
export const get = async (req, res) => {
    try {
        const jobs = await JobService.get();
        SuccessResponse(res, jobs);
    } catch (error) {
        ErrorResponse(res, error);
    }
};

export const create = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Trabajo debe tener información", 400);

    const session = await mongoose.startSession();
    try {
        const { licensePlate, isParticular } = req.body;
        if (!licensePlate)
            return ErrorResponse(res, "La Patente es requerida", 400);
        if (!req.body?.companyCUIT && !isParticular)
            return ErrorResponse(res, "El Compañía es requerido", 400);

        // Validate Vehicle
        let vehicle;
        try {
            vehicle = await VehicleService.getByLicense(formatLicensePlate(licensePlate), {
                session,
            });
        } catch (error) {
            vehicle = null;
        }
        if (!vehicle) return ErrorResponse(res, "Vehículo no encontrado", 400);

        // Validate Company
        let company;
        try {
            company = await CompanyService.getByCUIT(req.body?.companyCUIT, { session });
        } catch (error) {
            company = null;
        }
        if (!company && !isParticular) return ErrorResponse(res, "Compañía no encontrada", 400);

        const jobData = {
            vehicle: vehicle._id,
            company: company?._id || null,
            date: req?.body?.date,
            description: req?.body?.description,
            observations: req?.body?.observations,
            status: req?.body?.status,
            amount: req?.body?.amount,
            iva: req?.body?.iva,
            workPanels: req?.body?.workPanels,
            parts: req?.body?.parts,
            thumbnails: req?.body?.thumbnails,
            type: req?.body?.type,
            isParticular: req?.body?.type
        };

        // Start Session in case of rollback @Fran
        session.startTransaction();

        // Create Job
        const job = await JobService.create(jobData, { session });

        if(!isParticular){
            const claimData = {
                company: company._id,
                job: job._id,
                type: "MAIN",
            }
            console.log("claimData: ", claimData);
            // Create Claim
            const claim = await ClaimService.create(claimData, { session });
            
            // Insert Claim in Job
            await JobService.update(job._id, { claims: [claim._id] }, { session });
        }

        // Commit Transaction
        await session.commitTransaction();
        session.endSession();
        SuccessResponse(res, job);
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

export const deleteOne = async (req, res) => {
    const { id } = req.params;
    const job = await JobService.delete(id);
    SuccessResponse(res, job);
};
