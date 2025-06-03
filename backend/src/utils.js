import jwt from "jsonwebtoken";
// import passport from 'passport'
// import {fileURLToPath} from 'url'
// import { dirname } from 'path'
// import bcrypt from 'bcrypt'
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
// import config from './config/config.js'
// import nodemailer from 'nodemailer'

// export default __dirname;

// import { PDFDocument } from 'pdf-lib';
// import fs from 'fs';

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFParser from "pdf2json";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname;

const obj = {
    user: {
        username: "guest",
        first_name: "Guest",
        last_name: "User",
    },
    resources: [
        {
            type: "dashboard",
            id: "c219e656-71c3-4aeb-9663-3a2b876b2c94",
        },
    ],
    rls: [],
};

// const secret = "test-guest-secret-change-me";

// const token = jwt.sign(obj, secret, {
//     algorithm: "HS256",
//     expiresIn: "1h",
// });
// console.log("TOKEN: ", token);
// console.log("Token decode: ", jwt.decode(token));

/*
// Ruta del archivo PDF
const filePath = path.resolve(__dirname, "assets", "20438533452_011_00001_00000002.pdf");

console.log("Buscando archivo en:", filePath);

// Verificar si el archivo existe antes de procesarlo
if (!fs.existsSync(filePath)) {
    console.error("❌ Error: El archivo no existe en:", filePath);
    process.exit(1);
}

const extractDataFromPDF = (filePath) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            const firstPage = pdfData.Pages[0]; // 📌 Extraer solo la primera página

            if (!firstPage) {
                reject("❌ Error: No se encontró la primera página.");
                return;
            }

            // 📌 Extraer y ordenar los textos por posición en la página
            const textArray = firstPage.Texts.map(textItem => ({
                y: textItem.y, // Posición vertical
                x: textItem.x, // Posición horizontal
                text: decodeURIComponent(textItem.R[0].T) // Texto decodificado
            }));

            textArray.sort((a, b) => a.y - b.y || a.x - b.x);

            // 📌 Unir los textos extraídos en un solo string
            const extractedText = textArray.map(item => item.text).join(" ");

            console.log("✅ Texto extraído (Primera Página):\n", extractedText);

            // 📌 Expresiones regulares para extraer los datos clave
            const data = {
                fecha_emision: extractedText.match(/Fecha de Emisión:\s*(\d{2}\/\d{2}\/\d{4})/)?.[1] || "No encontrado",
                razon_social: extractedText.match(/Razón Social:\s*([\w\s]+)/)?.[1]?.trim() || "No encontrado",
                cuit: extractedText.match(/CUIT:\s*(\d{2}-\d{8}-\d{1}|\d{11})/)?.[1] || "No encontrado",
                domicilio: extractedText.match(/Domicilio:\s*([\w\s,.-]+)/)?.[1]?.trim() || "No encontrado",
                punto_venta: extractedText.match(/Punto de Venta:\s*(\d+)/)?.[1] || "No encontrado",
                comp_nro: extractedText.match(/Comp\. Nro:\s*(\d+)/)?.[1] || "No encontrado",
                cod: extractedText.match(/COD\.\s*(\d+)/)?.[1] || "No encontrado",
                producto_servicio: extractedText.match(/Producto \/ Servicio\s*(.*?)(?= Cantidad)/)?.[1]?.trim() || "No encontrado",
                cantidad: extractedText.match(/Cantidad\s*([\d,.]+)/)?.[1] || "No encontrado",
                unidad_medida: extractedText.match(/U\. Medida\s*([\w\s]+)/)?.[1]?.trim() || "No encontrado",
                precio_unitario: extractedText.match(/Precio Unit.\s*\$?([\d.,]+)/)?.[1] || "No encontrado",
                importe_total: extractedText.match(/Importe Total:\s*\$?([\d.,]+)/)?.[1] || "No encontrado",
                cae: extractedText.match(/CAE N°:\s*(\d+)/)?.[1] || "No encontrado",
                fecha_vto_cae: extractedText.match(/Fecha de Vto. de CAE:\s*(\d{2}\/\d{2}\/\d{4})/)?.[1] || "No encontrado"
            };

            console.log("✅ Datos extraídos:", data);
            resolve(data);
        });
        
        pdfParser.on("pdfParser_dataReady", pdfData => {
            const firstPage = pdfData.Pages[0]; // Solo la primera página
        
            if (!firstPage) {
                console.error("❌ Error: No se encontró la primera página.");
                return;
            }
        
            // Mostrar todas las coordenadas y textos
            firstPage.Texts.forEach(textItem => {
                console.log(`X: ${textItem.x}, Y: ${textItem.y}, Texto: ${decodeURIComponent(textItem.R[0].T)}`);
            });
        });
        

        pdfParser.loadPDF(filePath);
    });
};

// Ejecutar la extracción
extractDataFromPDF(filePath)
    .then((data) => console.log("✅ Extracción completada. Datos obtenidos:", data))
    .catch(error => console.error(error));


*/
