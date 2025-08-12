import express from "express";
import cookieParser from "cookie-parser";
// Sessions
import session from "express-session";
import passport from "passport";

// Docs
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

// Config
import __dirname from "./utils.js";
import cors from "cors";
import config from "./config/config.js";

import socket from "./socket.js";
import helmet from "helmet";

import mongoose from "mongoose";

// Port
const PORT = config.port || 8080;

// Init Servers
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Helmet for security
app.use(helmet());

// Cors
const corsOptions = {
    origin: ["http://localhost:5173", "http://192.168.0.19:5173"],
    credentials: true,
};
app.use(cors(corsOptions));

// Config Session
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    })
);

app.listen(PORT, () => console.log(`Listening on Port ${PORT}...`));
socket(app);
