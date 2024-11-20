import express from 'express';
import bodyParser from 'body-parser';
import { getAsistenPribadiResponse } from './chat.js';  // Mengimpor fungsi dari chat.js

const app = express();

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Endpoint untuk menerima deskripsi dan memberikan respons
app.post('/pesan', async (req, res) => {
    const { deskripsi } = req.body;  // Mengambil deskripsi dari body request

    // Validasi deskripsi
    if (!deskripsi) {
        return res.status(400).json({ error: 'Deskripsi tidak boleh kosong' });
    }

    try {
        // Menggunakan fungsi getAsistenPribadiResponse untuk mendapatkan respon
        const response = await getAsistenPribadiResponse(deskripsi);
        res.json({ ok: true, response });  // Mengirimkan respons dalam format JSON
    } catch (error) {
        console.error('Error in /pesan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Menjalankan server pada port 3000 atau port yang ditentukan di lingkungan
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
