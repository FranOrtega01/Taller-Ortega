// import messageDTO from '../DAO/DTO/message.dto.js'
export default class JobRepository{
    
    constructor(dao){
        this.dao = dao
    }

    get = async () => {
        try {
            return await this.dao.get()
        } catch (error) {
            throw new Error(error.message);
        }
    }

    create = async (data, options = {}) => {
        try {
            return await this.dao.create(data, options);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    update = async (id, data, options = {}) => {
        try {
            return await this.dao.update(id, data, options);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    delete = async (id, options = {}) => {
        try {
            return await this.dao.delete(id, options);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    createAmp = async (id, data, options = {}) => {
        try {
            return await this.dao.createAmp(id, data, options);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    updateAmp = async (id, ampId, data, options = {}) => {
        try {
            return await this.dao.updateAmp(id, ampId, data, options);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    deleteAmp = async (id, ampId, options = {}) => {
        try {
            return await this.dao.deleteAmp(id, ampId, options);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}