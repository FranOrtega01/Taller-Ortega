// import messageDTO from '../DAO/DTO/message.dto.js'

export default class ClaimRepository{
    
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

    create = async (data) => {
        try {
            return await this.dao.create(data);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    update = async (data) => {

    }

    deleteOne = async (id) => {
        
    }
}