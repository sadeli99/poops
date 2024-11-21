import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Array untuk menyimpan riwayat percakapan
let conversationHistory = [];

// Fungsi untuk memproses input teks dan memberikan respons
export async function getRoast(text) {
    try {
        console.log('Memproses teks:', userText);

        // Menyimpan pesan pengguna dalam riwayat
        conversationHistory.push({ sender: 'user', message: text });

        // Menyusun riwayat percakapan menjadi string untuk memberi konteks ke model
        let conversationContext = '';
        for (const entry of conversationHistory) {
            conversationContext += `${entry.sender === 'user' ? 'Aku' : 'Kamu'}: ${entry.message}\n`;
        }

        // Mengirimkan riwayat percakapan ke model untuk mendapatkan respons
        const result = await model.generateContent(conversationContext);
        const response = await result.response;

        // Mendapatkan respons dari model
        const botResponse = response.text();

        // Menyimpan balasan bot dalam riwayat
        conversationHistory.push({ sender: 'bot', message: botResponse });

        // Mengembalikan balasan bot
        return botResponse;
    } catch (error) {
        console.error('Gagal memproses permintaan:', error);
        throw error;
    }
}
