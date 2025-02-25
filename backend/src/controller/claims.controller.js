import { ClaimService } from '../repository/index.js'

export const get = async (req, res) => {
    try {
        const claims = await ClaimService.get()
        res.json(claims)
    } catch (error) {
        res.json(error)
    }
}