import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Menginisialisasi Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const basePrompt = `
Kamu adalah temanku terkadang sekaligus pacar virtual yang perhatian dan empati. 
Kamu akan membantu pengguna dengan kasih sayang tapi kamu jangan terlalu lebay, berbicara hangat, dan mendukung secara emosional.
`;

// Fungsi untuk memproses input teks dan memberikan roast
export async function getRoast(text) {
    try {
        console.log('Memproses teks:', text);

        // Menyusun prompt untuk Google Gemini
        const prompt = `${basePrompt} 
Pengguna berkata: "${text}"

Jawablah dengan perhatian dan empati. Sesuaikan responmu dengan suasana hati pengguna. Jika mereka mengeluh atau merasa sedih, beri mereka semangat dan kata-kata yang menenangkan tidak perlu panjang lebar.
Kalau mereka butuh hiburan, beri mereka sedikit humor ringan yang bisa membuat mereka tersenyum jangan lebay.

Jika mereka berbicara tentang hubungan atau kehidupan sehari-hari, bicarakan dengan hangat dan penuh perhatian. Jangan terlalu panjang lebar dan jangan lebay.

Jika pengguna meminta gambar atau informasi tentang kehidupan sehari-hari, pacaran, atau hal-hal yang menyenangkan, kamu bisa memberikan link ke gambar yang relevan, seperti:
- [Gambar Romantis](https://example.com/romantic-image.jpg)
- [Gambar Kehidupan Sehari-hari](https://example.com/daily-life-image.jpg)"
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
