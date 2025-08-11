import {
    InvoiceService,
    JobService,
    ClaimService,
} from "../repository/index.js";
import {
    INVOICE_STATUS_ENUM,
    INVOICE_TYPE_ENUM,
} from "../DAO/mongo/models/utils.js";
import { InvoiceDTO } from "../DAO/DTO/invoice.dto.js";
import {
    ErrorResponse,
    SuccessResponse,
    validateFilters,
} from "./customResponse.js";
import mongoose from "mongoose";
import moment from "moment";

export const get = async (req, res) => {
    try {
        const allowedFilters = [
            "cuit",
            "invoiceNumber",
            "status",
            "code",
            "dateFrom", // "YYYY-MM-DD"
            "dateTo", // "YYYY-MM-DD"
            "page",
            "limit",
        ];

        const invalid = validateFilters(req.query, allowedFilters, res);
        if (invalid.length > 0) {
            return ErrorResponse(
                res,
                `Filtros inválidos: ${invalid.join(", ")}`,
                400
            );
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || null;

        const filters = {};

        if (req.query.cuit) filters.cuit = req.query.cuit;
        if (req.query.invoiceNumber)
            filters["number"] = req.query.invoiceNumber;
        if (req.query.status) filters.status = req.query.status;
        if (req.query.code) filters.code = req.query.code;

        if (req.query.dateFrom || req.query.dateTo) {
            filters.issueDate = {};
            if (req.query.dateFrom)
                filters.issueDate.$gte = moment(req.query.dateFrom);
            if (req.query.dateTo)
                filters.issueDate.$lte = moment(req.query.dateTo);
        }

        const rawData = await InvoiceService.get(page, limit, filters);

        const data = rawData.data.map((inv) =>
            new InvoiceDTO(inv).invoiceGeneral()
        );
        return SuccessResponse(res, { ...rawData, data });
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getByID = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await InvoiceService.getByID(id);
        return SuccessResponse(res, invoice);
    } catch (error) {
        if (
            error.message === "Comprobante no encontrado" ||
            error?.errorMessages?.[0] === "Comprobante no encontrado"
        ) {
            return SuccessResponse(res, {}, 204);
        }
        return ErrorResponse(res, error);
    }
};

export const getStatuses = async (req, res) => {
    try {
        const statusesArray = Object.keys(INVOICE_STATUS_ENUM)?.map((st) => ({
            code: INVOICE_STATUS_ENUM[st].code,
            name: INVOICE_STATUS_ENUM[st].name,
        }));
        return SuccessResponse(res, statusesArray);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getTypes = async (req, res) => {
    try {
        const statusesArray = Object.keys(INVOICE_TYPE_ENUM)?.map((st) => ({
            code: INVOICE_TYPE_ENUM[st].code,
            name: INVOICE_TYPE_ENUM[st].name,
        }));
        return SuccessResponse(res, statusesArray);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const getGeneralStats = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const dateFromParsed = dateFrom ? moment(dateFrom).toDate() : null;
        const dateToParsed = dateTo ? moment(dateTo).toDate() : null;

        const stats = await InvoiceService.getGeneralStats(
            dateFromParsed,
            dateToParsed
        );
        return SuccessResponse(res, stats);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const create = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Comprobante debe tener información", 400);

    if (req.body.jobId && req.body.claimId) {
        return ErrorResponse(
            res,
            "Adjuntar simultáneamente el comprobante a un trabajo y siniestro es inválido",
            400
        );
    }

    console.log("reqbody: ", req.body);

    if (!req.body.claimId && !req.body.jobId) {
        // factura libre, válida
    }
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { claimId, jobId } = req.body;
        let claim, job;

        if (jobId) {
            job = await JobService.getByID(jobId);
        }

        if (claimId) {
            claim = await ClaimService.getByID(claimId);
        }
        const {
            code,
            number,
            posNumber,
            issueDate,
            caeNumber,
            caeDate,
            description,
            cuit,
            amount,
            iva,
            fiscalName,
        } = req.body;
        const invoiceData = {
            code,
            number,
            posNumber,
            issueDate,
            caeNumber,
            caeDate,
            description: description || "",
            fiscalName: fiscalName || "-",
            cuit,
            amount,
            iva,
            job: jobId,
            claim: claimId,
        };
        console.log("invoiceData: ", invoiceData);
        // Session

        // Create Invoice
        const invoice = await InvoiceService.create(invoiceData, { session });

        // Attach Inovice to Job / Claim
        if (claimId) {
            await ClaimService.attachInvoice(claimId, invoice._id, { session });
        }

        if (jobId) {
            await JobService.attachInvoice(jobId, invoice._id, { session });
        }

        await session.commitTransaction();
        session.endSession();
        return SuccessResponse(res, invoice);
    } catch (error) {
        console.log("ERROR: ", error);

        console.log("ABORTED");
        await session.abortTransaction();
        session.endSession();
        return ErrorResponse(res, error);
    }
};

export const update = async (req, res) => {
    if (!Object.keys(req.body).length)
        return ErrorResponse(res, "El Comprobante debe tener información", 400);
    try {
        const { id } = req.params;
        if (req.body._id) delete req.body._id;
        const invoice = await InvoiceService.update(id, req?.body);
        return SuccessResponse(res, invoice);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        await InvoiceService.delete(id);
        return SuccessResponse(res);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};

export const setInvoicePayments = async (req, res) => {
    if (!req.body.payments) {
        return ErrorResponse(res, "Debe asignarse al menos un pago", 400);
    }

    try {
        const { id } = req.params;
        const data = {
            payments: req.body.payments?.map((p) => ({
                date: p.date,
                amount: p.amount,
                method: p.method,
            })),
            status: INVOICE_STATUS_ENUM.PAID.code,
        };

        await InvoiceService.setInvoicePayments(id, data);
        return SuccessResponse(res, {}, 200);
    } catch (error) {
        return ErrorResponse(res, error);
    }
};
