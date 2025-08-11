import {
    Claim,
    Company,
    Estimate,
    Invoice,
    Job,
    Vehicle,
    Client,
    Supplier,
    SupplierAccountMovement,
    Purchase,
    Ledger,
} from "../DAO/factory.js";

import ClaimRepository from "./claims.repository.js";
import CompanyRepository from "./companies.repository.js";
import EstimateRepository from "./estimates.repository.js";
import InvoiceRepository from "./invoices.repository.js";
import JobRepository from "./jobs.repository.js";
import VehicleRepository from "./vehicles.repository.js";
import ClientRepository from "./clients.repository.js";
import SupplierRepository from "./suppliers.repository.js";
import SupplierAccountMovementRepository from "./supplierAccountMovements.repository.js";
import PurchaseRepository from "./purchases.repository.js";
import LedgerRepository from "./ledgers.repository.js";

export const ClaimService = new ClaimRepository(new Claim());
export const CompanyService = new CompanyRepository(new Company());
export const EstimateService = new EstimateRepository(new Estimate());
export const InvoiceService = new InvoiceRepository(new Invoice());
export const JobService = new JobRepository(new Job());
export const VehicleService = new VehicleRepository(new Vehicle());
export const ClientService = new ClientRepository(new Client());
export const SupplierService = new SupplierRepository(new Supplier());
export const SupplierAccountMovementService =
    new SupplierAccountMovementRepository(new SupplierAccountMovement());
export const PurchaseService = new PurchaseRepository(new Purchase());
export const LedgerService = new LedgerRepository(new Ledger());
