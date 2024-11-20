import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi Google Generative AI dengan API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Pilih model yang digunakan (misalnya, gemini-1.5-flash)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Fungsi untuk mengolah deskripsi dan memberikan respons
export async function getAsistenPribadiResponse(deskripsi) {
    const basePrompt = `
        Kamu adalah asisten pribadi sekaligus pacar virtual yang perhatian dan empati. 
        Kamu akan membantu pengguna dengan kasih sayang, berbicara hangat, dan mendukung secara emosional.
        Berikut adalah deskripsi yang diberikan oleh pengguna: 
        ${deskripsi}
    `;

    try {
        // Mengirim prompt ke model untuk mendapatkan respons
        const result = await model.generateContent([
            { text: basePrompt }
        ]);

        // Mengambil respons dari model dan mengembalikannya
        const response = await result.response;
        return response.text();  // Mengembalikan respons berupa teks
    } catch (error) {
        console.error('Error in generating response:', error);
        throw new Error('Terjadi kesalahan saat memproses permintaan.');
    }
}
