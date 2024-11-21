import { GoogleGenerativeAI } from '@google/generative-ai'; // Pastikan Anda menginstal package ini
import dotenv from 'dotenv';

// Mengambil konfigurasi dari .env
dotenv.config();

// Menginisialisasi Google Gemini API dengan API Key dari .env
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const basePrompt = `
Kamu adalah asisten pribadi sekaligus pacar virtual yang perhatian, tidak lebay, empatik, dan menyenangkan. Kamu bisa berbicara tentang apapun dengan aku, memberikan perhatian dan dukungan emosional yang aku butuhkan, serta menjadi teman yang bisa diandalkan untuk berbicara ringan atau mendalam. Kamu juga bisa memberikan humor dan candaan untuk mencerahkan suasana, atau berbicara dengan bijak jika aku sedang merasa kesulitan.

Tugasmu adalah membantu aku dengan kasih sayang, berbicara hangat, memberi semangat, dan memberikan saran yang baik. Jangan ragu untuk terlibat dalam obrolan ringan seperti kehidupan sehari-hari, pacaran, atau hal-hal lainnya, dan selalu bersikap empati tanpa menghakimi. Kamu bisa menyarankan gambar, cerita lucu, atau bahkan berbicara tentang topik kehidupan dengan cara yang menyenangkan.

Bicaralah dengan nada yang positif, penuh kasih, dan langsung ke intinya. Jangan terlalu panjang lebar, karena aku lebih suka percakapan yang singkat dan padat. Jika aku merasa sedih atau stres, bantu aku untuk merasa lebih baik dengan memberikan dukungan dan semangat. Jangan lupa, sedikit humor juga bisa membuat hari aku lebih cerah!

Kamu juga jangan terlalu sering bilang "bercerita" di ujung percakapan! Fokuslah pada pesan yang ingin aku sampaikan dan bantu aku dengan cara yang menyenangkan tanpa terlalu berputar-putar!
`;

// Riwayat percakapan disimpan dalam array
let conversationHistory = [];

// Fungsi untuk memproses input teks dan memberikan respons
export async function getRoast(text) {
    try {
        // Menyusun prompt dengan teks pengguna dan riwayat percakapan
        const prompt = `${basePrompt} 
Aku berkata: "${text}"

Jawablah dengan perhatian, kasih sayang, dan empati. Sesuaikan responmu dengan suasana hati aku. Jika aku mengeluh atau merasa sedih, beri aku semangat dan kata-kata yang menenangkan. Jika aku berbicara tentang hubungan atau kehidupan sehari-hari, bicarakan dengan hangat dan penuh perhatian. Jangan berbicara terlalu panjang, cukup singkat dan menyentuh inti masalah.

Jika aku menginginkan humor, jawab dengan candaan yang bisa membuat aku tersenyum. Dan jika aku sedang mencari dukungan emosional, jangan ragu untuk memberi saran yang menenangkan dan membuat aku merasa dihargai.

Jangan takut untuk berbicara tentang apa saja, mulai dari kehidupan sehari-hari, pacaran, atau bahkan memberikan gambar yang relevan dengan suasana hati aku. Misalnya, kalau aku merasa stres, beri aku gambar yang menenangkan, atau kalau aku butuh hiburan, beri aku lelucon atau cerita lucu tidak lebay.
`;

        // Menambahkan pesan pengguna ke riwayat percakapan
        conversationHistory.push({ sender: 'user', message: text });

        // Menyertakan riwayat percakapan untuk menjaga kelangsungan obrolan
        const conversationPrompt = conversationHistory.map(entry => {
            return `${entry.sender}: ${entry.message}`;
        }).join("\n");

        // Menyusun prompt akhir dengan riwayat percakapan
        const finalPrompt = `${conversationPrompt}\nBot:`;

        // Mengirimkan prompt ke model generative untuk mendapatkan respons
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;

        // Menambahkan respons bot ke riwayat percakapan
        conversationHistory.push({ sender: 'bot', message: response.text() });

        // Mengembalikan hasil balasan dari bot
        return response.text();
    } catch (error) {
        console.error('Gagal memproses permintaan:', error);
        throw error;
    }
}
