import moment from "moment";
import COLORS from "../components/common/theme/colors";

export const formatDNI = (dni) => {
    try {
        return dni.replace(/^(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3");
    } catch (er) {
        return dni;
    }
};

export const formatCUIT = (cuit) => {
    try {
        return cuit.replace(/^(\d{2})(\d{8})(\d{1})$/, "$1-$2-$3");
    } catch (er) {
        return cuit;
    }
};

export const formatLicense = (license) => {
    try {
        if (license.length === 6)
            return license.replace(/^([A-Z]{3})(\d{3})$/, "$1 $2");

        if (license.length === 7)
            return license.replace(/^([A-Z]{2})(\d{3})([A-Z]{2})$/, "$1 $2 $3");
    } catch (er) {
        return license;
    }
};

export const formatDate = (date, format = null) => {
    try {
        if (format) return moment(date).format(format);
        return moment(date).format("DD/MM/YY");
    } catch (er) {
        return date;
    }
};

export const formatNumberES = (number, decimals = 2) => {
    if (isNaN(number) || number === null || number === undefined) return "0,00";

    const fixed = Number(number).toFixed(decimals);
    const [integerPart, decimalPart] = fixed.split(".");

    const integerFormatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${integerFormatted},${decimalPart}`;
};

export const jobIsCompanyColor = (company) => {
    if (company === "Particular") return "orange";
    return "geekblue";
};

export const jobStatusColor = (status) => {
    switch (status) {
        case "PENDING":
            return "orange";
        case "IN_PROGRESS":
            return "geekblue";
        case "COMPLETED":
            return "green";
        case "CANCELLED":
            return "red";
        default:
            return "default";
    }
};

export const partStatusColor = (status) => {
    switch (status) {
        case "PENDING":
            return "orange";
        case "REJECTED":
            return "red";
        case "WAITING":
            return "gold";
        case "DELIVERING":
            return "gold";
        case "DELIVERED":
            return "green";
        default:
            return "default";
    }
};

export const estimateStatusColor = (status) => {
    switch (status) {
        case "PENDING":
            return "orange";
        case "REJECTED":
            return "red";
        case "PAID":
            return "green";
        default:
            return "orange";
    }
};

export const invoiceStatusColor = (status) => {
    switch (status) {
        case "ISSUED":
            return "geekblue";
        case "ISSUED":
            return "geekblue";
        case "PAID":
            return "green";
        case "REJECTED":
            return "red";
        case "CANCELED":
            return "volcano";
        default:
            return "orange";
    }
};

export const invoicePaymentStatusColor = (date, isPaid = false) => {
    if (isPaid) {
        return COLORS.GREEN;
    }
    const today = moment();
    const issuedDate = moment(date);
    const diffInDays = today.diff(issuedDate, "days");

    if (diffInDays <= 14) {
        return COLORS.BLUE;
    } else if (diffInDays <= 30) {
        return COLORS.ORANGE;
    } else {
        return COLORS.RED;
    }
};

export function toKebabLabel(str, withSuffix = true) {
    const kebab = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    return withSuffix ? `${kebab}-lbl` : kebab;
}

export const getClaimInvoiceDescription = (
    claimNumber,
    insured,
    vehicle,
    licensePlate
) => {
    return `Por trabajos realizados segun orden de trabajo adjunta.
Siniestro N° ${claimNumber}
Asegurado ${insured}
Vehiculo ${vehicle}
Dominio ${licensePlate}`;
};
