import { handleError } from "./utils.js";
export default class InvoiceRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async (page, limit, filters) => {
        try {
            return await this.dao.get(page, limit, filters);
        } catch (error) {
            throw handleError(error, "invoices");
        }
    };

    getByID = async (id) => {
        try {
            const invoice = await this.dao.getByID(id);
            if (!invoice) {
                throw new Error("Comprobante no encontrado");
            }
            return invoice;
        } catch (error) {
            throw handleError(error, "invoices");
        }
    };

    create = async (data, options = {}) => {
        try {
            return await this.dao.create(data, options);
        } catch (error) {
            throw handleError(error, "invoices");
        }
    };

    update = async (id, data, options = {}) => {
        try {
            return await this.dao.update(id, data, options);
        } catch (error) {
            throw handleError(error, "invoices");
        }
    };

    delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            throw handleError(error, "invoices");
        }
    };
}
