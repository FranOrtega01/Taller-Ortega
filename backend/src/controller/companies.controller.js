import { CompanyService } from "../repository/index.js";

export const get = async (req, res) => {
    try {
        const companies = await CompanyService.get();
        res.json(companies);
    } catch (error) {
        res.json({ status: "error", error: error?.message });
    }
};


export const create = async (req, res) => {
    try {
        const companies = await CompanyService.create(req?.body);
        res.json({status: "success", payload: companies});
    } catch (error) {
        res.json({ status: "error", error });
    }
};