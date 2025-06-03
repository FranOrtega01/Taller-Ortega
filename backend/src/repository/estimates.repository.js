import { handleError } from "./utils.js";
export default class EstimateRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return await this.dao.get();
        } catch (error) {
            throw handleError(error, "estimates");
        }
    };

    getByID = async (id) => {
        try {
            const estimate = await this.dao.getByID(id);
            if (!estimate) {
                throw new Error("Presupuesto no encontrado");
            }
            return estimate;
        } catch (error) {
            throw handleError(error, "estimates");
        }
    };

    create = async (data, options = {}) => {
        try {
            return await this.dao.create(data, options);
        } catch (error) {
            throw handleError(error, "estimates");
        }
    };

    update = async (id, data, options = {}) => {
        try {
            return await this.dao.update(id, data, options);
        } catch (error) {
            throw handleError(error, "estimates");
        }
    };

    delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            throw handleError(error, "estimates");
        }
    };
}
