const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI, GoogleAIFileManager } = require("google-generative-ai-sdk");

const app = express();

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Konfigurasi API Key dari environment variables
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

// Model yang digunakan
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Prompt dasar
const basePrompt = `
Kamu adalah asisten pribadi sekaligus pacar virtual yang perhatian dan empati. 
Kamu akan membantu pengguna dengan kasih sayang, berbicara hangat, dan mendukung secara emosional.
`;

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Kirim prompt ke Google Generative AI
        const response = await model.generate({
            prompt: `${basePrompt}\nPengguna: ${userMessage}\nAsisten:`,
            maxTokens: 150,
        });

        const reply = response.data?.text || "Maaf, aku tidak bisa menjawab itu sekarang.";

        res.json({ response: reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Terjadi masalah dengan API Generative AI." });
    }
});

// Menjalankan server
module.exports = app;
