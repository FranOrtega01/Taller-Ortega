import jobModel from "./models/job.model.js";

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
}
