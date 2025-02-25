import estimateModel from "./models/estimate.model.js";

export default class Estimate {
    constructor() {}

    get = async () => {
        return await estimateModel.find().lean().exec();
    };
}
