import { CLAIM_STATUS_ENUM } from "../mongo/models/utils.js";

export class ClaimDTO{
    constructor(claim){
        this.claim = claim
    }

    claimDetail(){
        const { job, status, ...rest } = this.claim;
        return {
            ...rest,
            status: CLAIM_STATUS_ENUM[status],
            job: {
                id: job?._id,
                vehicleRef: job?.vehicle?.licensePlate
            }
        };
    }
}