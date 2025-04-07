import mongoose from "mongoose";
import config from "../config/config.js";

export default {};
export let Claim;
export let Company;
export let Estimate;
export let Invoice;
export let Job;
export let Vehicle;
export let Client;
export let Supplier;
export let SupplierTransaction;
export let Purchase;

console.log(`PERSISTENCE: [${config.persistence}]`);
mongoose.set("strictQuery", false);

mongoose
    .connect(config.mongoURI, {
        dbName: config.mongoDBName,
    })
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const { default: ClaimMongo } = await import("./mongo/claims.mongo.js");
const { default: CompanyMongo } = await import("./mongo/companies.mongo.js");
const { default: EstimateMongo } = await import("./mongo/estimates.mongo.js");
const { default: InvoiceMongo } = await import("./mongo/invoices.mongo.js");
const { default: JobMongo } = await import("./mongo/jobs.mongo.js");
const { default: VehicleMongo } = await import("./mongo/vehicles.mongo.js");
const { default: ClientMongo } = await import("./mongo/clients.mongo.js");
const { default: SupplierMongo } = await import("./mongo/suppliers.mongo.js");
const { default: PurchaseMongo } = await import("./mongo/purchases.mongo.js");
const { default: SupplierTransactionMongo} = await import("./mongo/supplierTransactions.mongo.js")

Claim = ClaimMongo;
Company = CompanyMongo;
Estimate = EstimateMongo;
Invoice = InvoiceMongo;
Job = JobMongo;
Vehicle = VehicleMongo;
Client = ClientMongo;
Supplier = SupplierMongo;
SupplierTransaction = SupplierTransactionMongo
Purchase = PurchaseMongo;