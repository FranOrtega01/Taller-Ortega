import { handleError } from "./utils.js";

export default class CompanyRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return await this.dao.get();
        } catch (error) {
            throw handleError(error, "companies");
        }
    };

    getByID = async (id) => {
        try {
            const company = await this.dao.getByID(id);
            if (!company) {
                throw new Error("Compania no encontrada");
            }
            return company;
        } catch (error) {
            throw handleError(error, "companies");
        }
    };

    getByCUIT = async (id) => {
        try {
            const company = await this.dao.getByCUIT(id);
            if (!company) {
                throw new Error("Compania no encontrada");
            }
            return company;
        } catch (error) {
            throw handleError(error, "companies");
        }
    };

    getForDropdown = async () => {
        try {
            const company = await this.dao.getForDropdown();
            return company;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    create = async (data) => {
        try {
            return await this.dao.create(data);
        } catch (error) {
            throw handleError(error, "companies");
        }
    };

    update = async (id, data) => {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            throw handleError(error, "companies");
        }
    };

    delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            throw handleError(error, "companies");
        }
    };
}
