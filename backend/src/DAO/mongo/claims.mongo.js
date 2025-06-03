import claimModel from "./models/claim.model.js";
import { CLAIM_STATUS_ENUM, CLAIM_TYPE_ENUM } from "./models/utils.js";

export default class Claim {
    constructor() {}

    get = async () => {
        return await claimModel
            .find({ type: CLAIM_TYPE_ENUM.MAIN.code })
            .populate("company")
            .populate("job")
            .lean()
            .exec();
    };

    getByID = async (id) => {
        const claim = await claimModel
            .findOne({ _id: id })
            .populate("company")
            .populate("job")
            .lean()
            .exec();
        if (!claim) return null;

        const amps = await this.getAmpsByParent(id);
        claim.amps = amps;
        return claim;
    };

    getRawByID = async (id) => {
        return await claimModel.findOne({ _id: id });
    };

    getByNumber = async (number) => {
        return await claimModel
            .findOne({ number: number })
            .populate("company")
            .populate("job")
            .lean()
            .exec();
    };

    getAmpsByParent = async (parentId) => {
        return await claimModel.find({
            parentClaim: parentId,
            type: CLAIM_TYPE_ENUM.AMP.code,
        });
    };

    getManyByCompany = async (company) => {
        return await claimModel
            .findOne({ company: company })
            .populate("company")
            .populate("job")
            .lean()
            .exec();
    };

    create = async (data, options = {}) => {
        const result = await claimModel.create([data], options);
        return result[0];
    };

    updateActiveClaim = async (id, data, options = {}) => {
        return await claimModel.updateOne(
            { _id: id },
            { $set: data },
            { runValidators: true, ...options }
        );
    };

    delete = async (id, options = {}) => {
        return await claimModel.deleteOne({ _id: id }, options);
    };

    activate = async (id, data = {}, options = {}) => {
        const claim = await claimModel.findById(id);
        if (!claim) {
            throw new Error("Siniestro no encontrado");
        }
        if (claim.status !== CLAIM_STATUS_ENUM.PENDING.code) {
            throw new Error("El Siniestro no está pendiente");
        }
        data.status = CLAIM_STATUS_ENUM.ACTIVE.code;

        let newData = {
            status: CLAIM_STATUS_ENUM.ACTIVE.code,
            deductible: data.deductible,
            amount: data.amount,
            iva: data.iva,
            workPanels: data.workPanels,
            parts: data.parts,
            thumbnails: data.thumbnails,
            date: data.date,
        };

        if (data.type === CLAIM_TYPE_ENUM.MAIN.code) {
            newData = {
                ...newData,
                number: data.number,
            };
        }

        claim.set(newData);

        await claim.validate();

        return await claim.save(options);
    };

    createClaimAmp = async (id, data, options = {}) => {
        const claim = await claimModel.findById(id);
        if (!claim) {
            throw new Error("El Siniestro referenciado no existe");
        }

        const ampData = {
            type: CLAIM_TYPE_ENUM.AMP.code,
            parentClaim: id,
            number: claim.number,
            company: claim.company,
            job: claim.job,
            ...data,
        };
        if (!ampData.amount && !ampData.deductible && !ampData.iva) {
            ampData.status = CLAIM_STATUS_ENUM.PENDING.code;
        } else {
            ampData.status = CLAIM_STATUS_ENUM.ACTIVE.code;
        }
        const result = await claimModel.create([ampData], options);
        return result[0];
    };

    attachInvoice = async (id, invoiceId, options = {}) => {
        const claim = await claimModel.findById(id);
        claim.associatedInvoices.push(invoiceId);
        await claim.save(options);
        return claim;
    };
}
