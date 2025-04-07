import { handleError } from "./utils.js";

export default class ClientRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return await this.dao.get();
        } catch (error) {
            throw handleError(error, "clients");
        }
    };

    getById = async (id) => {
        try {
            const client = await this.dao.getByID(id);
            if (!client) {
                throw new Error("Cliente no encontrado");
            }
            return client;
        } catch (error) {
            throw handleError(error, "clients");
        }
    };

    create = async (data) => {
        try {
            return await this.dao.create(data);
        } catch (error) {
            throw handleError(error, "clients");
        }
    };

    update = async (id, data) => {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            throw handleError(error, "clients");
        }
    };

    delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            throw handleError(error, "clients");
        }
    };
}
