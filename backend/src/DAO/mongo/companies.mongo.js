import companyModel from "./models/company.model.js";

export default class Company {
    constructor() {}

    get = async () => {
        return await companyModel.find().lean().exec();
    };
    getByID = async (id) => {
        return await companyModel.findOne({ _id: id }).lean().exec();
    };
    getByCUIT = async (cuit) => {
        return await companyModel.findOne({ cuit }).lean().exec();
    };
    create = async (data) => {
        return await companyModel.create(data);
    };
    update = async (id, data) => {
        return await companyModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true }
        );
    };
    delete = async (id) => {
        return await companyModel.deleteOne({ _id: id });
    };
}
