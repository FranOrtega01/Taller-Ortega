import {
    JOB_STATUS_ENUM,
    PART_STATUS_ENUM,
    ESTIMATE_STATUS_ENUM,
} from "../mongo/models/utils.js";

import { InvoiceDTO } from "./invoice.dto.js";

export class JobDTO {
    constructor(job) {
        this.job = job;
    }

    get id() {
        return this.job._id;
    }

    get status() {
        return this.job.status;
    }

    get company() {
        return this.job.claims?.[0]?.company?.name || null;
    }

    get claimCount() {
        return this.job?.claims?.length || 0;
    }

    get nonCancelledClaimCount() {
        return (
            this.job?.claims?.filter((c) => c.status !== "CANCELLED")?.length ||
            0
        );
    }

    get totalAmount() {
        return this.job?.claims?.reduce((sum, c) => sum + (c.amount || 0), 0);
    }

    get isFullyPaid() {
        return this.job?.claims?.every((c) => c.status === "PAID");
    }
    jobGeneral() {
        const { vehicle, claims, ...rest } = this.job;
        return {
            date: rest?.date,
            status: JOB_STATUS_ENUM[rest?.status],
            _id: rest?._id,
            isParticular: rest?.isParticular || false,
            claims: claims?.map((claim) => ({
                id: claim._id,
                status: claim.status,
                amount: claim.amount,
                company: claim.company?.name || null,
            })),
            vehicle: {
                brand: vehicle?.brand || null,
                model: vehicle?.model || null,
                licensePlate: vehicle?.licensePlate || null,
                owner: {
                    name: vehicle?.owner?.name || null,
                    lastname: vehicle?.owner?.lastname || null,
                },
            },
            company: this.company,
        };
    }

    jobDetail() {
        const {
            status,
            parts,
            vehicle,
            claims,
            amount,
            estimate,
            iva,
            associatedInvoices,
            ...rest
        } = this.job;
        const rawJob = {
            ...rest,
            expenses: {
                amount,
                iva,
            },
            parts: parts?.map((p) => ({
                ...p,
                status: PART_STATUS_ENUM[p?.status],
            })),
            status: JOB_STATUS_ENUM[status],
            vehicle: {
                ...vehicle,
            },
            companyData: {
                company: this.company,
            },
            estimate: null,
        };

        if (!this.job?.isParticular) {
            rawJob.companyData.claims = {
                claims: this.job?.claims || [],
                totalClaims: this.claimCount,
                activeClaims: this.nonCancelledClaimCount,
            };
        }
        
        if (estimate) {
            const { job, ...estimateRest } = estimate;
            rawJob.estimate = {
                ...estimateRest,
                status: ESTIMATE_STATUS_ENUM[estimate.status],
            };
        }
        return rawJob;
    }

    jobsFromClient() {
        const { vehicle, claims, ...rest } = this.job;
        return {
            ...rest,
            claims,
            claimsTotalAmount: this.totalAmount,
            claimsCount: this.claimCount,
            company: this.company,
            vehicle: {
                brand: vehicle?.brand || null,
                model: vehicle?.model || null,
            },
        };
    }
}
