import companyModel from "./models/company.model.js";

export default class Company {
    constructor() {}

    get = async () => {
        return await companyModel.find().lean().exec();
    };

    create = async (data) => {
        return await companyModel.create(data);
    }

    update = async (id, data) => {

    }

    delete = async(id) => {
        
    }
}
