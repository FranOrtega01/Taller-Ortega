import estimateModel from "./models/estimate.model.js";

export default class Estimate {
    constructor() {}

    get = async () => {
        return await estimateModel.find().lean().exec();
    };
    getByID = async (id) => {
        return await estimateModel.findOne({ _id: id }).lean().exec();
    };
    create = async (data) => {
        return await estimateModel.create(data);
    };
    update = async (id, data) => {
        return await estimateModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true }
        );
    };
    delete = async (id) => {
        return await estimateModel.deleteOne({ _id: id });
    };
}
