const axios = require('axios');
const cheerio = require('cheerio');

class PoopLink {
    constructor() {
        this.link = '';
        this.axiosInstance = axios.create({
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' }
        });
    }

    async redirect(url) {
        const response = await this.axiosInstance.head(url, { maxRedirects: 0 });
        return response.headers.location || url;
    }

    async getLink(domain, id) {
        try {
            // Step 1: Redirect to the first URL
            const url1 = await this.redirect(`https://${domain}/p0?id=${id}`);
            const req1 = await this.axiosInstance.get(url1);

            // Step 2: Extract second URL and authorization token
            const $ = cheerio.load(req1.data);
            const url2 = $('script')
                .text()
                .match(/returnfetch"([^"]+)"/)?.[1];  // Menarik URL untuk pengambilan data lebih lanjut

            const auth = $('script')
                .text()
                .match(/"Authorization":"([^"]+)"/)?.[1];  // Menarik token otorisasi

            if (!url2 || !auth) {
                throw new Error('Gagal mengekstrak URL atau token Authorization');
            }

            // Langkah 3: Mengambil link unduhan atau streaming
            const headers = {
                Authorization: auth,
                Origin: `https://${domain}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
            };

            const req2 = await this.axiosInstance.get(url2, { headers });
            this.link = req2.data?.direct_link || '';  // Menyimpan link langsung unduhan atau streaming
        } catch (error) {
            console.error('Error saat mengambil link:', error.message);
        }
    }
}

module.exports = { PoopLink };
