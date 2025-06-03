import { ClientService } from "../repository/index.js";
import { handleError } from "./utils.js";

export default class VehicleRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return await this.dao.get();
        } catch (error) {
            throw handleError(error, "vehicles");
        }
    };

    getByLicense = async (lic) => {
        try {
            const vehicle = await this.dao.getByLicense(lic);
            if (!vehicle) {
                throw new Error("Vehiculo no encontrado");
            }
            return vehicle;
        } catch (error) {
            throw handleError(error, "vehicles");
        }
    };
    create = async (data) => {
        try {
            const { owner } = data;
            const client = await ClientService.getById(owner);
            data.licensePlate = data.licensePlate;
            data.owner = client._id;
            return await this.dao.create(data);
        } catch (error) {
            throw handleError(error, "vehicles");
        }
    };

    update = async (lic, data) => {
        try {
            const { owner } = data;
            const client = await ClientService.getById(owner);
            data.owner = client._id;

            console.log("LIC: ", lic, "DATA: ", data);

            return await this.dao.update(lic, data);
        } catch (error) {
            throw handleError(error, "vehicles");
        }
    };

    delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            throw handleError(error, "vehicles");
        }
    };
}
