import clientModel from "./models/client.model.js";

export default class Client {
    constructor() {}

    get = async () => {
        return await clientModel.find().lean().exec();
    };
    getByID = async (id) => {
        return await clientModel.findOne({ id: id }).lean().exec();
    };
    create = async (data) => {
        return await clientModel.create(data);
    };
    update = async (id, data) => {
        return await clientModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true }
        );
    };
    delete = async (id) => {
        return await clientModel.deleteOne({ _id: id });
    };
}
