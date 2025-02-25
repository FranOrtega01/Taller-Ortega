import { InvoiceService } from '../repository/index.js'

export const get = async (req, res) => {
    try {
        const invoices = await InvoiceService.get()
        res.json(invoices)
    } catch (error) {
        res.json(error)
    }
}