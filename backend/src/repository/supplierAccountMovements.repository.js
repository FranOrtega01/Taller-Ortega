import { handleError } from "./utils.js";

export default class SupplierAccountMovementRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return await this.dao.get();
        } catch (error) {
            throw handleError(error, "supplier_account_movements");
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
            throw handleError(error, "supplier_account_movements");
        }
    };

     getBySupplier = async (id) => {
        try {
            return await this.dao.getBySupplier(id);
        } catch (error) {
            throw handleError(error, "supplier_account_movements");
        }
    };

    create = async (data, options = {}) => {
        try {            
            return await this.dao.create(data, options);
        } catch (error) {
            throw handleError(error, "supplier_account_movements");
        }
    };

    update = async (id, data) => {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            throw handleError(error, "supplier_account_movements");
        }
    };

    delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            throw handleError(error, "supplier_account_movements");
        }
    };
}
