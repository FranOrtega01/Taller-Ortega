// import messageDTO from '../DAO/DTO/message.dto.js'

export default class CompanyRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return await this.dao.get();
        } catch (error) {
            throw new Error(error.message);
        }
    };

    create = async (data) => {
        try {
            return await this.dao.create(data);
        } catch (error) {
            throw this.handleError(error, data)
        }
    };

    update = async (data) => {};

    deleteOne = async (id) => {};

    handleError(error, data) {
        console.log("DATA", data);
        console.log("ERROR", error);

        
        let response = {message: "Error en la base de datos", errorMessages: [] };

        if (error.name === "ValidationError") {
            response.message = "Error de validación";
            response.errorMessages = Object.values(error.errors).map(e => e.message);
        } else if (error.code === 11000) {
            response.message = "Error de duplicado";
            const duplicatedField = Object.keys(error.keyPattern)[0]; 
            const validationMessage = error.errors?.[duplicatedField]?.message || `${duplicatedField.charAt(0).toUpperCase() + duplicatedField.slice(1)} ya está registrado.`;
            response.errorMessages = [validationMessage];
        } else {
            response.errorMessages = [error.message];
        }

        return response;
    }
}
