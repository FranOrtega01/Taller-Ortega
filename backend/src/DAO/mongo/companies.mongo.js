import companyModel from "./models/company.model.js";

export default class Company {
    constructor() {}

    get = async () => {
        return await companyModel.find().lean().exec();
    };
}
