import axios from 'axios';
import cheerio from 'cheerio';

const defaultDomain = 'poop.run';

class PoopFile {
  constructor() {
    this.files = [];
    this.r = axios.create();
    this.headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' };
  }

  async redirect(url) {
    const response = await this.r.head(url, { headers: this.headers, maxRedirects: 0 });
    return response.headers.location;
  }

  async getAllFile(url) {
    if (url.includes('/e/')) {
      const id = url.split('/').pop().split('?')[0].toLowerCase();
      url = `https://${defaultDomain}/d/${id}`;
      return this.getAllFile(url);
    }

    const baseUrl = await this.redirect(url);
    const req = await this.r.get(baseUrl, { headers: this.headers });
    const $ = cheerio.load(req.data);
    this.domain = req.request.res.responseUrl.replace('//', '/').split('/')[1];

    const typeUrl = baseUrl.split('/')[2].toLowerCase();

    if (typeUrl === 'f') {
      const listPage = Array.from(new Set(this.getAllPage($)));
      for (let page of listPage) {
        try {
          const pageReq = await this.r.get(page, { headers: this.headers });
          const $ = cheerio.load(pageReq.data);
          this.multiFile($);
        } catch (error) {
          continue;
        }
      }
    } else if (typeUrl === 'd') {
      this.singleFile(baseUrl);
    } else if (typeUrl === 'top') {
      for (let i = 1; i <= 10; i++) {
        try {
          const topReq = await this.r.get(`https://${this.domain}/top?p=${i}`, { headers: this.headers });
          const $ = cheerio.load(topReq.data);
          this.multiFile($);
        } catch (error) {
          continue;
        }
      }
    }
  }

  getAllPage($) {
    return $('a.page-link').map((i, el) => `https://${this.domain}${$(el).attr('href')}`).get();
  }

  multiFile($) {
    $('div').each((i, el) => {
      const fileDiv = $(el).html();
      if (fileDiv && fileDiv.includes('<strong>')) {
        try {
          const id = $(el).find('a').attr('href').split('/').pop().split('?')[0];
          const name = $(el).find('strong').text().trim();
          const image = $(el).find('img').attr('src');
          this.files.push({ domain: this.domain, id, name, image });
        } catch (error) {
          return;
        }
      }
    });
  }

  async singleFile(url) {
    try {
      const req = await this.r.get(url, { headers: this.headers });
      const $ = cheerio.load(req.data);
      const id = url.split('/').pop().split('?')[0];
      const name = $('h4').text().trim();
      const image = $('img').attr('src');
      this.files.push({ domain: this.domain, id, name, image });
    } catch (error) {
      return;
    }
  }
}

export default async function handler(req, res) {
  const { url } = req.query;
  const PF = new PoopFile();
  await PF.getAllFile(url);
  res.status(200).json({ files: PF.files });
}
