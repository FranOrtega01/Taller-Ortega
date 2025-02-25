import jobModel from "./models/job.model.js";

export default class Job {
    constructor() {}

    get = async () => {
        return await jobModel.find().lean().exec();
    };
}
