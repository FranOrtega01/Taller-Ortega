import invoiceModel from "./models/invoice.model.js";

export default class Invoice {
    constructor() {}

    get = async (page = 1, limit, filters = {}) => {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            invoiceModel
                .find(filters)
                .populate({
                    path: "job",
                    populate: { path: "vehicle" },
                })
                .populate({
                    path: "claim",
                    populate: {
                        path: "job",
                        populate: { path: "vehicle" },
                    },
                })
                .sort({ issueDate: -1, code: 1, number: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            invoiceModel.countDocuments(filters),
        ]);

        return {
            data,
            totalItems: total,
        };
    };
    getByID = async (id) => {
        return await invoiceModel.findOne({ _id: id }).lean().exec();
    };
    create = async (data, options = {}) => {
        const result = await invoiceModel.create([data], options);
        return result[0];
    };
    update = async (id, data, options = {}) => {
        return await invoiceModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true, ...options }
        );
    };
    delete = async (id) => {
        return await invoiceModel.deleteOne({ _id: id });
    };

    setInvoicePayments = async (id, data, options = {}) => {
        return await invoiceModel.updateOne(
            { _id: id },
            { $set: { payments: data.payments, status: data.status } },
            { runValidators: true, ...options }
        );
    };
}
