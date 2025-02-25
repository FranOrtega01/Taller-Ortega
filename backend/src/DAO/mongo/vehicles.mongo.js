import vehicleModel from "./models/vehicle.model.js";

export default class Vehicle {
    constructor() {}

    get = async () => {
        return await vehicleModel.find().lean().exec();
    };
}
