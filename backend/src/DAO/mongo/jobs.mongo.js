import { populate } from "dotenv";
import jobModel from "./models/job.model.js";
import { JOB_STATUS_ENUM } from "./models/utils.js";

export default class Job {
    constructor() {}

    // get = async (page = 1, limit, filters = {}) => {
    //     const skip = (page - 1) * limit;
    //     const [data, total] = await Promise.all([
    //         jobModel
    //             .find(filters)
    //             .skip(skip)
    //             .populate({ path: "vehicle", populate: { path: "owner" } })
    //             .populate({
    //                 path: "claims",
    //                 populate: {
    //                     path: "company",
    //                 },
    //             })
    //             .lean()
    //             .exec(),
    //         jobModel.countDocuments(filters),
    //     ]);

    //     return {
    //         data,
    //         totalItems: total,
    //     };
    // };

    get = async (page = 1, limit = 10, filters = {}) => {
        const skip = (page - 1) * limit;

        const matchStage = {};

        // Filtros directos del modelo Job
        if (filters.status) matchStage["status"] = filters.status;
        if (filters.isParticular !== undefined)
            matchStage.isParticular = filters.isParticular;
        if (filters.dateFrom || filters.dateTo) {
            matchStage.date = {};
            if (filters.dateFrom) matchStage.date.$gte = filters.dateFrom;
            if (filters.dateTo) matchStage.date.$lte = filters.dateTo;
        }

        // Filtros sobre datos relacionados
        const populatedMatch = {};
        if (filters.licensePlate)
            populatedMatch["vehicle.licensePlate"] = filters.licensePlate;
        if (filters.brand) populatedMatch["vehicle.brand"] = filters.brand;
        if (filters.model) populatedMatch["vehicle.model"] = filters.model;
        if (filters.ownerName)
            populatedMatch["vehicle.owner.name"] = filters.ownerName;
        if (filters.ownerLastname)
            populatedMatch["vehicle.owner.lastname"] = filters.ownerLastname;
        if (filters.cuit) populatedMatch["claims.company.cuit"] = filters.cuit;

        const pipeline = [
            { $match: matchStage },

            // VEHICLE
            {
                $lookup: {
                    from: "vehicles",
                    localField: "vehicle",
                    foreignField: "_id",
                    as: "vehicle",
                },
            },
            { $unwind: { path: "$vehicle", preserveNullAndEmptyArrays: true } },

            // OWNER dentro de vehicle
            {
                $lookup: {
                    from: "clients",
                    localField: "vehicle.owner",
                    foreignField: "_id",
                    as: "owner",
                },
            },
            {
                $unwind: { path: "$owner", preserveNullAndEmptyArrays: true },
            },
            {
                $addFields: {
                    "vehicle.owner": "$owner", // ✅ solo una vez
                },
            },

            // CLAIMS
            {
                $lookup: {
                    from: "claims",
                    localField: "claims",
                    foreignField: "_id",
                    as: "claims",
                },
            },

            // Unwind de claims para asociar company individualmente
            {
                $unwind: {
                    path: "$claims",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // COMPANY dentro de cada claim
            {
                $lookup: {
                    from: "companies",
                    localField: "claims.company",
                    foreignField: "_id",
                    as: "claimCompany",
                },
            },
            {
                $unwind: {
                    path: "$claimCompany",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    "claims.company": "$claimCompany",
                },
            },

            // Agrupar para volver a juntar claims
            {
                $group: {
                    _id: "$_id",
                    date: { $first: "$date" },
                    status: { $first: "$status" },
                    isParticular: { $first: "$isParticular" },
                    vehicle: { $first: "$vehicle" },
                    claims: { $push: "$claims" },
                },
            },

            // Si todos los claims son null, limpiarlos
            {
                $addFields: {
                    claims: {
                        $cond: {
                            if: { $eq: ["$claims", [null]] },
                            then: [],
                            else: "$claims",
                        },
                    },
                },
            },

            // Filtros sobre relaciones (vehicle.*, claims.*)
            ...(Object.keys(populatedMatch).length > 0
                ? [{ $match: populatedMatch }]
                : []),

            // Proyección final
            {
                $project: {
                    _id: 1,
                    date: 1,
                    status: 1,
                    isParticular: 1,
                    vehicle: 1,
                    claims: 1,
                },
            },
            {
                $sort: {
                    date: -1,
                },
            },
            { $skip: skip },
            ...(limit ? [{ $limit: limit }] : []),
        ];

        // Obtener resultados y total
        const [data, totalCountResult] = await Promise.all([
            jobModel.aggregate(pipeline),
            jobModel.aggregate([
                { $match: matchStage },
                ...pipeline.slice(
                    4,
                    pipeline.findIndex((p) => p.$skip !== undefined)
                ),
                ...(Object.keys(populatedMatch).length > 0
                    ? [{ $match: populatedMatch }]
                    : []),
                { $count: "count" },
            ]),
        ]);

        const totalItems = totalCountResult[0]?.count || data.length;
        return {
            data,
            totalItems,
            totalPages: limit ? Math.ceil(totalItems / limit) : 1,
            currentPage: page,
        };
    };

    getByID = async (id) => {
        return await jobModel
            .findOne({ _id: id })
            .populate("estimate")
            .populate("associatedInvoices")
            .populate({ path: "vehicle", populate: { path: "owner" } })
            .populate({
                path: "claims",
                populate: {
                    path: "company",
                },
            })
            .populate({
                path: "claims",
                populate: {
                    path: "associatedInvoices",
                },
            })
            .lean()
            .exec();
    };

    getByClient = async (id) => {
        const jobs = await jobModel
            .find()
            .populate({
                path: "vehicle",
                populate: {
                    path: "owner",
                    match: { id },
                },
            })
            .populate({ path: "claims", populate: { path: "company" } })
            .lean();

        return jobs.filter((job) => job.vehicle?.owner);
    };

    getAllClaimsForJob = async (id) => {
        return await jobModel.findOne({ _id: id });
    };

    create = async (data, options = {}) => {
        const result = await jobModel.create([data], options);
        return result[0];
    };

    update = async (id, data, options = {}) => {
        return await jobModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true, ...options }
        );
    };

    updateParts = async (id, parts) => {
        return await jobModel.updateOne(
            { _id: id },
            { $set: { parts } },
            { runValidators: true }
        );
    };
    delete = async (id, options = {}) => {
        return await jobModel.deleteOne({ _id: id }, options);
    };

    createAmp = async (id, data, options = {}) => {
        const job = await jobModel.findById(id);
        if (!job) {
            throw new Error("Trabajo no encontrado");
        }
        if (job.status !== JOB_STATUS_ENUM.IN_PROGRESS.code) {
            throw new Error("El trabajo no está en curso");
        }
        job.amps.push(data);
        await job.save(options);
        return job;
    };

    updateAmp = async (id, ampId, data, options = {}) => {
        const job = await jobModel.findById(id);
        if (!job) {
            throw new Error("Trabajo no encontrado");
        }
        if (job.status !== JOB_STATUS_ENUM.IN_PROGRESS.code) {
            throw new Error("El trabajo no está en curso");
        }
        const amp = job.amps.id(ampId);
        if (!amp) {
            throw new Error("Ampliación no encontrada");
        }

        console.log(data);

        for (const key in data) {
            if (data[key] === undefined) continue;
            amp.set(key, data[key]);
        }

        console.log(amp);

        await job.validate();
        await job.save(options);
        return job;
    };

    deleteAmp = async (id, ampId, options = {}) => {
        const job = await jobModel.findById(id);
        job.amps = job?.amps?.filter(
            (amp) => amp._id.toString() !== ampId.toString()
        );
        await job.save(options);
        return job;
    };

    attachInvoice = async (id, invoiceId, options = {}) => {
        const job = await jobModel.findById(id);
        if (!job) {
            throw new Error("Trabajo no encontrado");
        }
        job.associatedInvoices.push(invoiceId);
        await job.save(options);
        return job;
    };

    activateJob = async (id, data, options = {}) => {
        const job = await jobModel.findById(id);
        console.log(data);

        if (!job) {
            throw new Error("Trabajo no encontrado");
        }
        if (job.status !== JOB_STATUS_ENUM.PENDING.code) {
            throw new Error("El trabajo ya fue activado");
        }
        Object.assign(job, data);
        return await job.save();
    };

    completeJob = async (id, data, options = {}) => {
        const job = await jobModel.findById(id);
        Object.assign(job, data);
        return await job.save();
    };
}
