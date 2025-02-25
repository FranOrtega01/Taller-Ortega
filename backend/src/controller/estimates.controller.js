import { EstimateService } from '../repository/index.js'

export const get = async (req, res) => {
    try {
        const estimates = await EstimateService.get()
        res.json(estimates)
    } catch (error) {
        res.json(error)
    }
}