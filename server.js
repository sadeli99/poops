import express from 'express';
import { getRoast } from './chat.js'; // Import fungsi dari chat.js
import cors from 'cors'; // Untuk mengizinkan CORS

const app = express();

// Middleware untuk parsing JSON
app.use(express.json()); // Untuk menerima body request dalam format JSON
app.use(cors()); // CORS untuk akses dari berbagai domain

// Endpoint API untuk menerima teks dan menghasilkan roast
app.post('/pesan', async (req, res) => {
    try {
        const { text } = req.body; // Mengambil teks dari request body

        if (!text) {
            return res.status(400).json({ error: 'Teks diperlukan.' });
        }

        // Memanggil fungsi getRoast untuk memproses teks
        const roast = await getRoast(text);
        res.json({ ok: true, text: roast }); // Mengirimkan hasil roast sebagai respons
    } catch (error) {
        console.error('Gagal memproses permintaan:', error);
        res.status(500).json({ error: 'Terjadi kesalahan di server.' });
    }
});

// Menjalankan server pada port tertentu
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
