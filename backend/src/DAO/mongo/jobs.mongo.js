import jobModel from "./models/job.model.js";
import { JOB_STATUS_ENUM } from "./models/utils.js";

export default class Job {
    constructor() {}

    get = async () => {
        return await jobModel
            .find()
            .populate("vehicle")
            .populate({
                path: "claims",
                populate: {
                    path: "company",
                },
            })
            .lean()
            .exec();
    };

    getByID = async (id) => {
        return await jobModel
            .findOne({ _id: id })
            .populate("vehicle")
            .populate({
                path: "claims",
                populate: {
                    path: "company",
                },
            })
            .lean()
            .exec();
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
            if(data[key] === undefined) continue;
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
}
