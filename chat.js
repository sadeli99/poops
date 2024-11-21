import { GoogleGenerativeAI } from '@google/generative-ai'; // Pastikan Anda menginstal package ini
import dotenv from 'dotenv';

// Mengambil konfigurasi dari .env
dotenv.config();

// Menginisialisasi Google Gemini API dengan API Key dari .env
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let conversationHistory = []; // Riwayat percakapan disimpan di sini

// Fungsi untuk memproses input teks dan memberikan respons
export async function getRoast(text) {
    try {
        // Menyimpan pesan pengguna dalam riwayat percakapan
        conversationHistory.push({ sender: 'user', message: text });

        // Menggabungkan semua percakapan sebelumnya untuk diproses oleh model
        const conversationText = conversationHistory.map(entry => {
            return `${entry.sender}: ${entry.message}`;
        }).join("\n");

        // Menambahkan pesan untuk model generatif, meskipun kita tidak menggunakan prompt langsung
        const result = await model.generateContent(conversationText);
        const response = await result.response;

        // Menyimpan respons bot ke riwayat percakapan
        conversationHistory.push({ sender: 'bot', message: response.text() });

        // Mengembalikan hasil balasan dari bot
        return response.text();
    } catch (error) {
        console.error('Gagal memproses permintaan:', error);
        throw error;
    }
}
