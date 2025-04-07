import {
    Claim,
    Company,
    Estimate,
    Invoice,
    Job,
    Vehicle,
    Client,
    Supplier,
    SupplierTransaction,
    Purchase,
} from "../DAO/factory.js";

import ClaimRepository from "./claims.repository.js";
import CompanyRepository from "./companies.repository.js";
import EstimateRepository from "./estimates.repository.js";
import InvoiceRepository from "./invoices.repository.js";
import JobRepository from "./jobs.repository.js";
import VehicleRepository from "./vehicles.repository.js";
import ClientRepository from "./clients.repository.js";
import SupplierRepository from "./suppliers.repository.js";
import SupplierTransactionRepository from "./supplierTransactions.repository.js";
import PurchaseRepository from "./purchases.repository.js";

export const ClaimService = new ClaimRepository(new Claim());
export const CompanyService = new CompanyRepository(new Company());
export const EstimateService = new EstimateRepository(new Estimate());
export const InvoiceService = new InvoiceRepository(new Invoice());
export const JobService = new JobRepository(new Job());
export const VehicleService = new VehicleRepository(new Vehicle());
export const ClientService = new ClientRepository(new Client());
export const SupplierService = new SupplierRepository(new Supplier());
export const SupplierTransactionService = new SupplierTransactionRepository(new SupplierTransaction())
export const PurchaseService = new PurchaseRepository(new Purchase());
