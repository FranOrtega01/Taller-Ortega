import { VehicleService } from '../repository/index.js'

export const get = async (req, res) => {
    try {
        const vehicles = await VehicleService.get()
        res.status(200).json({status: "success" ,vehicles})
    } catch (error) {
        res.json(error)
    }
}