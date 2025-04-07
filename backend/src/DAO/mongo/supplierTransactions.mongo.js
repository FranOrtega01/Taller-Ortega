import supplierTransactionModel from "./models/supplierTransaction.model.js";

export default class SupplierTransaction {
    constructor() {}

    get = async () => {
        return await supplierTransactionModel.find().populate("supplier").lean().exec();
    };
    getByID = async (id) => {
        return await supplierTransactionModel.findOne({ _id: id }).lean().exec();
    };
    create = async (data, options = {}) => {
        const result = await supplierTransactionModel.create([data], options);
        return result[0];
    };
    update = async (id, data) => {
        return await supplierTransactionModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true }
        );
    };
    delete = async (id) => {
        return await supplierTransactionModel.deleteOne({ _id: id });
    };
}

