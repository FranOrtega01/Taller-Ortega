import claimModel from "./models/claim.model.js";

export default class Claim {
    constructor() {}

    get = async () => {
        return await claimModel.find().lean().exec();
    };
}

