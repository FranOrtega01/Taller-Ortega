// src/modules/ledger/dao/ledger.dao.ts
import mongoose from "mongoose";
import supplierAccountMovementModel from "./models/supplierAccountMovement.model.js";

const { ObjectId } = mongoose.Types;

export default class SupplierTransaction {
    constructor() {}

    getSupplierPreviousBalanceBefore = async (supplierId, startDate) => {
        const [row] = await supplierAccountMovementModel
            .aggregate([
                {
                    $match: {
                        supplier: new ObjectId(supplierId),
                        date: { $lt: startDate },
                    },
                },
                { $project: { amount: { $subtract: ["$debit", "$credit"] } } },
                { $group: { _id: null, previousBalance: { $sum: "$amount" } } },
                { $project: { _id: 0, previousBalance: 1 } },
            ])
            .allowDiskUse(true);
        console.log("rows: ", row);
        console.log("supplierId", supplierId);
        
            
        return row?.previousBalance ?? 0;
    };

    getSupplierMovementsInRange = async (supplierId, startDate, endDate) => {
        return await supplierAccountMovementModel
            .find({
                supplier: supplierId,
                date: { $gte: startDate, $lte: endDate },
            })
            .sort({ date: 1, _id: 1 })
            .select({
                date: 1,
                concept: 1,
                debit: 1,
                credit: 1,
                method: 1,
                origin: 1,
                referenceId: 1,
            })
            .lean();
    };
}
