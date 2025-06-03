export class VehicleDTO {
    constructor(vehicle) {
        console.log(vehicle);

        this.vehicle = vehicle;
    }

    vehicleOwner() {
        const { owner } = this.vehicle;
        return {
            ...owner,
        };
    }

    vehicleGeneral() {
        const { owner, ...rest } = this.vehicle;
        return {
            ...rest,
            owner: owner?.name || "",
        };
    }

    vehicleDetail() {
        return this.vehicle;
    }
}
