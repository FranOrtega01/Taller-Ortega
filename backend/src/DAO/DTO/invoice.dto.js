import { INVOICE_TYPE_ENUM, INVOICE_STATUS_ENUM } from "../mongo/models/utils.js";

export class InvoiceDTO {
    constructor(invoice) {
        this.invoice = invoice;
    }

    invoiceGeneral() {
        const { code, status, ...rest } = this.invoice;
        return {
            ...rest,
            code: INVOICE_TYPE_ENUM[code],
            status: INVOICE_STATUS_ENUM[status]
        };
    }

    invoiceDetail() {
        return this.invoice;
    }
}