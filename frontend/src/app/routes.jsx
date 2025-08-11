import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

const JobModule = lazy(() => import("../modules/JobModule"));
const ClaimModule = lazy(() => import("../modules/ClaimModule"));
const ClientModule = lazy(() => import("../modules/ClientModule"));
const VehicleModule = lazy(() => import("../modules/VehicleModule"));
const CompanyModule = lazy(() => import("../modules/CompanyModule"));
const InvoiceModule = lazy(() => import("../modules/InvoiceModule"));
const SupplierModule = lazy(() => import("../modules/SupplierModule"));
const PurchaseModule = lazy(() => import("../modules/PurchaseModule"));
const EstimateModule = lazy(() => import("../modules/EstimateModule"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "trabajos/*",
                element: <JobModule />,
            },
            {
                path: "siniestros/*",
                element: <ClaimModule />,
            },
            {
                path: "clientes/*",
                element: <ClientModule />,
            },
            {
                path: "vehiculos/*",
                element: <VehicleModule />,
            },
            {
                path: "companias/*",
                element: <CompanyModule />,
            },
            {
                path: "facturacion/*",
                element: <InvoiceModule />,
            },
            {
                path: "proveedores/*",
                element: <SupplierModule />,
            },
            {
                path: "compras/*",
                element: <PurchaseModule />,
            },
            {
                path: "presupuestos/*",
                element: <EstimateModule />,
            },
        ],
    },
]);

export default router;
