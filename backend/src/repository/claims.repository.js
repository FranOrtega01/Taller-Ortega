// import messageDTO from '../DAO/DTO/message.dto.js'

export default class ClaimRepository {
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
    getByID = async (id) => {
        try {
            const claim = await this.dao.getByID(id);
            if (!claim) {
                throw new Error("Siniestro no encontrado");
            }
            return claim;
        } catch (error) {
            throw new Error(error.message);
        }
    };
    create = async (data, options = {}) => {
        try {
            return await this.dao.create(data, options);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    updateActiveClaim = async (id, data, options = {}) => {
        try {
            return await this.dao.updateActiveClaim(id, data, options);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    delete = async (id, options = {}) => {
        try {
            return await this.dao.delete(id, options);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    activate = async (id, data = {}, options = {}) => {
        try {
            return await this.dao.activate(id, data, options);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    createClaimAmp = async (id, data, options = {}) => {
        try {
            return await this.dao.createClaimAmp(id, data, options);
        } catch (error) {
            throw new Error(error.message);
        }
    };
}
