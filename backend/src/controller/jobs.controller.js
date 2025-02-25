import { JobService } from '../repository/index.js'

export const get = async (req, res) => {
    try {
        const jobs = await JobService.get()
        res.json(jobs)
    } catch (error) {
        res.json(error)
    }
}