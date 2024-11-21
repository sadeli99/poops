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

        // Menambahkan logika untuk menjawab pertanyaan tentang nama
        if (text.toLowerCase().includes('nama kamu siapa') || text.toLowerCase().includes('siapa nama kamu')) {
            const botResponse = "Nama saya Nitah, senang bisa mengobrol denganmu!";
            conversationHistory.push({ sender: 'bot', message: botResponse });
            return botResponse;
        }

        // Menambahkan logika untuk menanyakan bagaimana kabar bot
        if (text.toLowerCase().includes('kabar kamu bagaimana') || text.toLowerCase().includes('apa kabar kamu')) {
            const botResponse = "Saya baik-baik saja, terima kasih sudah bertanya! Gimana kabarmu?";
            conversationHistory.push({ sender: 'bot', message: botResponse });
            return botResponse;
        }

        // Menambahkan logika untuk menanyakan bagaimana kabar bot
        if (text.toLowerCase().includes('hai nitah') || text.toLowerCase().includes('apa kabar kamu')) {
            const botResponse = "Hai juga, ada yang bisa saya bantu heheh";
            conversationHistory.push({ sender: 'bot', message: botResponse });
            return botResponse;
        }

        // Menambahkan logika untuk menyapa pengguna
        if (text.toLowerCase().includes('halo') || text.toLowerCase().includes('hai')) {
            const botResponse = "Halo! Ada yang bisa aku bantu?";
            conversationHistory.push({ sender: 'bot', message: botResponse });
            return botResponse;
        }

        // Menambahkan logika untuk menjawab pertanyaan tentang perasaan
        if (text.toLowerCase().includes('perasaan kamu bagaimana') || text.toLowerCase().includes('gimana perasaan kamu')) {
            const botResponse = "Perasaan saya sangat baik, apalagi setelah berbicara dengan kamu!";
            conversationHistory.push({ sender: 'bot', message: botResponse });
            return botResponse;
        }

        // Menambahkan logika untuk mengucapkan terima kasih
        if (text.toLowerCase().includes('terima kasih') || text.toLowerCase().includes('makasih')) {
            const botResponse = "Sama-sama kak, senang bisa membantu!";
            conversationHistory.push({ sender: 'bot', message: botResponse });
            return botResponse;
        }

        // Menambahkan logika untuk menjawab pertanyaan tentang cuaca
        if (text.toLowerCase().includes('cuaca hari ini') || text.toLowerCase().includes('bagaimana cuaca')) {
            const botResponse = "Aku tidak bisa melihat cuaca, tapi semoga hari ini cerah untukmu!";
            conversationHistory.push({ sender: 'bot', message: botResponse });
            return botResponse;
        }

        if (text.toLowerCase().includes('carikan')) {
            const itemRequest = text.toLowerCase().replace('carikan', '').trim(); // Mengambil apa yang ingin dicari pengguna
            const botResponse = `Baik Kak, Nitah akan carikan ${itemRequest} untukmu!`;
            conversationHistory.push({ sender: 'bot', message: botResponse });
            return botResponse;
        }

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
