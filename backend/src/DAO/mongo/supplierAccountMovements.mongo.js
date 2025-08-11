import supplierAccountMovementModel from "./models/supplierAccountMovement.model.js";

export default class SupplierTransaction {
    constructor() {}

    get = async () => {
        return await supplierAccountMovementModel.find().populate("supplier").lean().exec();
    };
    getByID = async (id) => {
        return await supplierAccountMovementModel.findOne({ _id: id }).lean().exec();
    };
    getBySupplier = async (id) => {
        return await supplierAccountMovementModel.find({ supplier: id }).populate("supplier").lean().exec();
    };
    create = async (data, options = {}) => {
        const result = await supplierAccountMovementModel.create([data], options);
        return result[0];
    };
    update = async (id, data) => {
        return await supplierAccountMovementModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true }
        );
    };
    delete = async (id) => {
        return await supplierAccountMovementModel.deleteOne({ _id: id });
    };
}

