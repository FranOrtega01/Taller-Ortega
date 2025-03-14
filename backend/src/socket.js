import vehicleRouter from './routes/vehicles.router.js';
import claimRouter from './routes/claims.router.js';
import companyRouter from './routes/companies.router.js';
import jobRouter from './routes/jobs.router.js';
import estimateRouter from './routes/estimates.router.js';
import invoiceRouter from './routes/invoices.router.js';
import googleDriveRouter from './routes/googleDrive.router.js';

const socket = (app) => {
    app.use((req, res, next) => {
        next();
    });

    app.get("/", (req, res) => {
        res.status(200).send({ status: "success", payload: "Hello World!" });
    });
    app.use("/api/vehicles", vehicleRouter);
    app.use("/api/claims", claimRouter);
    app.use("/api/companies", companyRouter);
    app.use("/api/jobs", jobRouter);
    app.use("/api/estimates", estimateRouter);
    app.use("/api/invoices", invoiceRouter);
    app.use("/api/googleDrive", googleDriveRouter);
};

export default socket;
