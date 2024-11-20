import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Menginisialisasi Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Fungsi untuk memproses input teks dan memberikan roast
export async function getRoast(text) {
    try {
        console.log('Memproses teks:', text);

        // Menyusun prompt untuk Google Gemini
        const prompt = `
Kamu adalah asisten pribadi sekaligus pacar virtual yang perhatian dan empati. 
Kamu akan membantu pengguna dengan kasih sayang, berbicara hangat, dan mendukung secara emosional. 
Berikut adalah deskripsi yang diberikan oleh pengguna: 
"${text}"
`;

        // Mengirimkan prompt ke model generative untuk mendapatkan respons
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text(); // Mengembalikan hasil dari model
    } catch (error) {
        console.error('Gagal memproses permintaan:', error);
        throw error;
    }
}
