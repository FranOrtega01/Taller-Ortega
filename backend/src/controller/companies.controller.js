import { CompanyService } from '../repository/index.js'

export const get = async (req, res) => {
    try {
        const companies = await CompanyService.get()
        res.json(companies)
    } catch (error) {
        res.json(error)
    }
}