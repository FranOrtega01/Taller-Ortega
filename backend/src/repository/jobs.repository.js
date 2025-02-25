// import messageDTO from '../DAO/DTO/message.dto.js'

export default class JobRepository{
    
    constructor(dao){
        this.dao = dao
    }

    get = async () => {
        return await this.dao.get()
    }
}