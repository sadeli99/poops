const axios = require('axios');
const cheerio = require('cheerio');

class PoopFile {
    constructor() {
        this.file = [];
        this.domain = '';
        this.axiosInstance = axios.create({
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' }
        });
    }

    async redirect(url) {
        const response = await this.axiosInstance.head(url, { maxRedirects: 0 });
        return response.headers.location || url;
    }

    async getAllFile(url) {
        const baseUrl = await this.redirect(url);
        const req = await this.axiosInstance.get(baseUrl);
        this.domain = req.request.res.responseUrl.split('/')[2];

        const $ = cheerio.load(req.data);
        const type = baseUrl.split('/')[3];

        if (type === 'f') {
            const pages = [...new Set(this.getAllPages($))];
            for (const page of pages) {
                const pageReq = await this.axiosInstance.get(page);
                const pageSoup = cheerio.load(pageReq.data);
                this.multiFile(pageSoup);
            }
        } else if (type === 'd') {
            await this.singleFile(baseUrl);
        }
    }

    getAllPages($) {
        const pages = [];
        $('a.page-link').each((_, el) => {
            pages.push(`https://${this.domain}${$(el).attr('href')}`);
        });
        return pages;
    }

    multiFile($) {
        $('div').each((_, el) => {
            const id = $(el).find('a').attr('href')?.split('/').pop();
            const name = $(el).find('strong').text();
            const image = $(el).find('img').attr('src');
            if (id && name) {
                this.file.push({ domain: this.domain, id, name, image });
            }
        });
    }

    async singleFile(url) {
        const req = await this.axiosInstance.get(url);
        const $ = cheerio.load(req.data);
        const id = url.split('/').pop();
        const name = $('h4').text();
        const image = $('img').attr('src');
        this.file.push({ domain: this.domain, id, name, image });
    }
}

module.exports = { PoopFile };
