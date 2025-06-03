import { VehicleService } from "../repository/index.js";
import {
    SuccessResponse,
    ErrorResponse,
    formatLicensePlate,
} from "./customResponse.js";
import { VehicleDTO } from "../DAO/DTO/vehicle.dto.js";

export const get = async (req, res) => {
    try {
        const vehicles = await VehicleService.get();
        const formattedVehicles = vehicles.map((vehicle) =>
            new VehicleDTO(vehicle).vehicleGeneral()
        );
        return SuccessResponse(res, formattedVehicles);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getByLicense = async (req, res) => {
    try {
        const { license } = req.params;
        const vehicle = await VehicleService.getByLicense(license);
        const formattedVehicles = new VehicleDTO(vehicle).vehicleDetail();
        return SuccessResponse(res, formattedVehicles);
    } catch (error) {
        if (
            error.message === "Vehiculo no encontrado" ||
            error?.errorMessages?.[0] === "Vehiculo no encontrado"
        ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const getClientByLicensePlate = async (req, res) => {
    try {
        const { license } = req.params;
        const vehicle = await VehicleService.getByLicense(license);
        const formattedClient = new VehicleDTO(vehicle).vehicleOwner();
        return SuccessResponse(res, formattedClient);
    } catch (error) {
        if (
            error.message === "Vehiculo no encontrado" ||
            error?.errorMessages?.[0] === "Vehiculo no encontrado"
        ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const create = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El vehiculo debe tener información", 400);
    try {
        req.body.licensePlate = formatLicensePlate(req.body.licensePlate);
        const newVehicle = await VehicleService.create(req.body);
        return SuccessResponse(res, newVehicle);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const update = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El vehiculo debe tener información", 400);
    try {
        const { license } = req.params;
        if (req.body.licensePlate) delete req.body.licensePlate;
        const vehicle = await VehicleService.update(
            formatLicensePlate(license),
            req?.body
        );
        return SuccessResponse(res, vehicle);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await VehicleService.delete(id);

        return SuccessResponse(res, data);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};
