import purchaseModel from "./models/purchase.model.js";

export default class Purchase {
    constructor() {}

    get = async () => {
        return await purchaseModel.find().lean().exec();
    };
    getByID = async (id) => {
        return await purchaseModel.findOne({ _id: id }).lean().exec();
    };
    create = async (data) => {
        return await purchaseModel.create(data);
    };
    update = async (id, data) => {
        return await purchaseModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true }
        );
    };
    delete = async (id) => {
        return await purchaseModel.deleteOne({ _id: id });
    };
}
