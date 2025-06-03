import estimateModel from "./models/estimate.model.js";

export default class Estimate {
    constructor() {}

    get = async () => {
        return await estimateModel.find().lean().exec();
    };
    getByID = async (id) => {
        return await estimateModel.findOne({ _id: id }).lean().exec();
    };
    create = async (data, options = {}) => {
        const result = await estimateModel.create([data], options);
        return result[0];
    };
    update = async (id, data, options = {}) => {
        return await estimateModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true, ...options }
        );
    };
    delete = async (id) => {
        return await estimateModel.deleteOne({ _id: id });
    };
}
