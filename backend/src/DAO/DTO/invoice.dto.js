import { INVOICE_TYPE_ENUM, INVOICE_STATUS_ENUM } from "../mongo/models/utils.js";

export class InvoiceDTO {
    constructor(invoice) {
        this.invoice = invoice;
    }

    invoiceGeneral() {
        const { code, status, job, claim, ...rest } = this.invoice;
        return {
            ...rest,
            code: INVOICE_TYPE_ENUM[code],
            status: INVOICE_STATUS_ENUM[status],
            origin: {
                type: job ? "JOB" : "CLAIM",
                data: {
                    id: job ? job?._id : claim?._id,
                    vehicleRef: job ? job.vehicle?.licensePlate : claim?.job?.vehicle?.licensePlate
                }
            }
        };
    }

    invoiceDetail() {
        return this.invoice;
    }
}