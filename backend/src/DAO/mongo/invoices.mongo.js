import invoiceModel from "./models/invoice.model.js";

export default class Invoice {
    constructor() {}

    get = async () => {
        return await invoiceModel.find().lean().exec();
    };
}
