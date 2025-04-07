import { handleError } from "./utils.js";
export default class PurchaseRepository{
    
    constructor(dao){
        this.dao = dao
    }

    get = async () => {
        try {
            return await this.dao.get();
        } catch (error) {
            throw handleError(error, "purchases");
        }
    };

    getByID = async (id) => {
        try {
            const estimate = await this.dao.getByID(id);
            if (!estimate) {
                throw new Error("Compra no encontrada");
            }
            return estimate;
        } catch (error) {
            throw handleError(error, "purchases");
        }
    };

    create = async (data) => {
        try {
            return await this.dao.create(data);
        } catch (error) {
            throw handleError(error, "purchases");
        }
    };

    update = async (id, data) => {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            throw handleError(error, "purchases");
        }
    };

    delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            throw handleError(error, "purchases");
        }
    };
}