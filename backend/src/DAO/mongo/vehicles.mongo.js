import vehicleModel from "./models/vehicle.model.js";

export default class Vehicle {
    constructor() {}

    get = async () => {
        return await vehicleModel.find().populate("owner").lean().exec();
    };

    getByLicense = async (lic) => {
        return await vehicleModel
            .findOne({ licensePlate: lic })
            .populate("owner")
            .lean()
            .exec();
    };

    create = async (data) => {
        return await vehicleModel.create(data);
    };

    update = async (lic, data) => {
        return await vehicleModel.updateOne(
            { licensePlate: lic },
            { $set: data },
            { runValidators: true }
        );
    };

    delete = async (id) => {
        return await vehicleModel.deleteOne({ _id: id });
    };
}
