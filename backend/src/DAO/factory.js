import mongoose from "mongoose";
import config from '../config/config.js'

export default {};
export let Claim;
export let Company;
export let Estimate;
export let Invoice;
export let Job;
export let Vehicle;

console.log(`PERSISTENCE: [${config.persistence}]`);
mongoose.set("strictQuery", false);

mongoose.connect(config.mongoURI, {
    dbName: config.mongoDBName,
})
.then(() => console.log("DB Connected"))
.catch(err => console.error("MongoDB connection error:", err));


const { default: ClaimMongo } = await import("./mongo/claims.mongo.js");
const { default: CompanyMongo } = await import("./mongo/companies.mongo.js");
const { default: EstimateMongo } = await import("./mongo/estimates.mongo.js");
const { default: InvoiceMongo } = await import("./mongo/invoices.mongo.js");
const { default: JobMongo } = await import("./mongo/jobs.mongo.js");
const { default: VehicleMongo } = await import("./mongo/vehicles.mongo.js");

Claim = ClaimMongo;
Company = CompanyMongo;
Estimate = EstimateMongo;
Invoice = InvoiceMongo;
Job = JobMongo;
Vehicle = VehicleMongo;
