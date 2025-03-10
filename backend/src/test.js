import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdf from 'pdf-parse';

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta del archivo PDF
const filePath = path.resolve(__dirname, "assets", "20438533452_011_00001_00000002.pdf");

console.log("Buscando archivo en:", filePath);

// Verificar si el archivo existe antes de procesarlo
if (!fs.existsSync(filePath)) {
    console.error("❌ Error: El archivo no existe en:", filePath);
    process.exit(1);
}

// Función para limpiar y normalizar el texto
const normalizeText = (text) => {
    return text
        .replace(/\n/g, ' \n ') // Mantener saltos de línea
        .replace(/(\d)([A-Za-z])/g, '$1 $2') // Separar números pegados con texto
        .replace(/([A-Za-z])(\d)/g, '$1 $2') // Separar texto pegado con números
        .replace(/\s{2,}/g, ' ') // Reemplazar múltiples espacios por uno solo
        .trim();
};

const extractTextFromPDF = async (filePath) => {
    try {
        // Leer el archivo PDF
        const pdfBuffer = fs.readFileSync(filePath);
        const data = await pdf(pdfBuffer, { max: 1 }); // 📌 SOLO EXTRAE LA PRIMERA PÁGINA

        // Normalizar texto para mejorar estructura
        const text = normalizeText(data.text);

        console.log("✅ Texto Extraído (Primera Página):\n", text);
        return text;

    } catch (error) {
        console.error("❌ Error al procesar el PDF:", error);
    }
};

// Ejecutar la extracción
extractTextFromPDF(filePath);
