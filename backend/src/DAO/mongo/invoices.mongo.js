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

    getGeneralStats = async (dateFrom = null, dateTo = null) => {
        // Construir filtro de fechas si corresponde
        const dateFilter = {};
        if (dateFrom) dateFilter.$gte = new Date(dateFrom);
        if (dateTo) dateFilter.$lte = new Date(dateTo);

        const matchStage = Object.keys(dateFilter).length
            ? [{ $match: { issueDate: dateFilter } }]
            : [];

        // 1. Cantidad por tipo de invoice
        const byType = await invoiceModel.aggregate([
            ...matchStage,
            { $group: { _id: "$code", count: { $sum: 1 } } },
        ]);

        // 2. Cantidad por status de invoice
        const byStatus = await invoiceModel.aggregate([
            ...matchStage,
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        // 3. Cantidad por compañía
        const byCompany = await invoiceModel.aggregate([
            ...matchStage,
            { $match: { cuit: { $ne: null } } },
            { $group: { _id: "$cuit", count: { $sum: 1 } } },
        ]);

        // 4. Cantidad de particulares (code: "X")
        const particulars = await invoiceModel.countDocuments({
            ...(Object.keys(dateFilter).length && { issueDate: dateFilter }),
            code: "X",
        });

        // 5. Otros (ni code: "X" ni cuit)
        const others = await invoiceModel.countDocuments({
            ...(Object.keys(dateFilter).length && { issueDate: dateFilter }),
            code: { $ne: "X" },
            cuit: null,
        });

        // 6. Total de invoices (con o sin filtro de fecha)
        const totalInvoices = await invoiceModel.countDocuments(
            Object.keys(dateFilter).length ? { issueDate: dateFilter } : {}
        );

        return {
            totalInvoices,
            byType,
            byStatus,
            byCompany,
            particulars,
            others,
        };
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
