import { Claim, Company, Estimate, Invoice, Job, Vehicle } from '../DAO/factory.js'

import ClaimRepository from './claims.repository.js'
import CompanyRepository from './companies.repository.js'
import EstimateRepository from './estimates.repository.js'
import InvoiceRepository from './invoices.repository.js'
import JobRepository from './jobs.repository.js'
import VehicleRepository from './vehicles.repository.js'

export const ClaimService = new ClaimRepository(new Claim)
export const CompanyService = new CompanyRepository(new Company)
export const EstimateService = new EstimateRepository(new Estimate)
export const InvoiceService = new InvoiceRepository(new Invoice)
export const JobService = new JobRepository(new Job)
export const VehicleService = new VehicleRepository(new Vehicle)