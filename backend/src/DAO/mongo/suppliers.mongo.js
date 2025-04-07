import supplierModel from "./models/supplier.model.js";

export default class Supplier {
    constructor() {}

    get = async () => {
        return await supplierModel.find().lean().exec();
    };
    getByID = async (id) => {
        return await supplierModel.findOne({ _id: id }).lean().exec();
    };
    getByCUIT = async (cuit) => {
        return await supplierModel.findOne({ cuit }).lean().exec();
    };
    create = async (data) => {
        return await supplierModel.create(data);
    };
    update = async (id, data) => {
        return await supplierModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true }
        );
    };
    delete = async (id) => {
        return await supplierModel.deleteOne({ _id: id });
    };
}
