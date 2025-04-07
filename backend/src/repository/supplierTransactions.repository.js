import { handleError } from "./utils.js";
import { SupplierService } from "./index.js";

export default class SupplierTransactionRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return await this.dao.get();
        } catch (error) {
            throw handleError(error, "supplier_transactions");
        }
    };

    getByID = async (id) => {
        try {
            const estimate = await this.dao.getByID(id);
            if (!estimate) {
                throw new Error("Movimiento no encontrado");
            }
            return estimate;
        } catch (error) {
            throw handleError(error, "supplier_transactions");
        }
    };

    create = async (data, options = {}) => {
        try {            
            return await this.dao.create(data, options);
        } catch (error) {
            throw handleError(error, "supplier_transactions");
        }
    };

    update = async (id, data) => {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            throw handleError(error, "supplier_transactions");
        }
    };

    delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            throw handleError(error, "supplier_transactions");
        }
    };
}
