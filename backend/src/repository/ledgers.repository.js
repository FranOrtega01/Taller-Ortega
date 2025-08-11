import { handleError } from "./utils.js";

export default class LedgerRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getSupplierPreviousBalanceBefore = async (supplierId, start) => {
        try {
            return await this.dao.getSupplierPreviousBalanceBefore(
                supplierId,
                start
            );
        } catch (error) {
            throw handleError(error, "ledgers");
        }
    };

    getSupplierMovementsInRange = async (supplierId, start, end) => {
        try {
            return await this.dao.getSupplierMovementsInRange(
                supplierId,
                start,
                end
            );
        } catch (error) {
            throw handleError(error, "ledgers");
        }
    };
}
