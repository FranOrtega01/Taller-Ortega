import { handleError } from "./utils.js";

export default class SupplierRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return await this.dao.get();
        } catch (error) {
            throw handleError(error, "suppliers");
        }
    };

    getByID = async (id) => {
        try {
            const supplier = await this.dao.getByID(id);
            if (!supplier) {
                throw new Error("Proveedor no encontrado");
            }
            return supplier;
        } catch (error) {
            throw handleError(error, "suppliers");
        }
    };

    getByCUIT = async (cuit) => {
        try {
            const supplier = await this.dao.getByCUIT(cuit);
            if (!supplier) {
                throw new Error("Proveedor no encontrado");
            }
            return supplier;
        } catch (error) {
            throw handleError(error, "suppliers");
        }
    };


    create = async (data) => {
        try {
            return await this.dao.create(data);
        } catch (error) {
            throw handleError(error, "suppliers");
        }
    };

    update = async (id, data) => {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            throw handleError(error, "suppliers");
        }
    };

    delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            throw handleError(error, "suppliers");
        }
    };
}
