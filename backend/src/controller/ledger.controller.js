// src/modules/ledger/controllers/ledger.controller.ts
import {
    supplierParamsSchema,
    ledgerQuerySchema,
} from "../schemas/ledger.schema.js";
import { LedgerService } from "../repository/index.js";
import { SuccessResponse, ErrorResponse } from './customResponse.js';
import { endOfMonthUTC, startOfMonthUTC } from "../utils.js";

const round2 = (n) => Math.round(n * 100) / 100;

export const getSupplierLedger = async (req, res) => {
    try {
        const { supplierId } = supplierParamsSchema.parse(req.params);
        const { year, month } = ledgerQuerySchema.parse(req.query);

        console.log("supplierid controller:", supplierId);
        

        const start = startOfMonthUTC(year, month);
        const end = endOfMonthUTC(year, month);

        const previousBalance =
            await LedgerService.getSupplierPreviousBalanceBefore(
                supplierId,
                start
            );
        const docs = await LedgerService.getSupplierMovementsInRange(
            supplierId,
            start,
            end
        );

        let running = round2(previousBalance);
        const rows = docs.map((d) => {
            const debit = round2(d.debit ?? 0);
            const credit = round2(d.credit ?? 0);
            running = round2(running + (debit - credit));
            return {
                date: d.date,
                concept: d.concept,
                debit,
                credit,
                method: d.method ?? null,
                origin: d.origin,
                referenceId: d.referenceId ?? null,
                runningBalance: running,
            };
        });

        const monthDelta = rows.reduce(
            (acc, r) => acc + (r.debit - r.credit),
            0
        );
        const closingBalance = round2(previousBalance + monthDelta);

        return SuccessResponse(res, {
            supplierId,
            month: `${year}-${String(month).padStart(2, "0")}`,
            previousBalance: round2(previousBalance),
            closingBalance,
            rows,
        });
    } catch (err) {
        return ErrorResponse(res, err, 400);
    }
};
