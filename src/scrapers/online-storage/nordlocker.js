const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class NordLocker {

  async scrapeListings(page){
    const document_name = 'NordLocker';
    const html = await page.content();
    const $ = cheerio.load(html);

    const listing = await $('.Pricing > .h-full').map((index, element) => {  
      const storage_space = $(element).find('.mb-6').text();
      const monthly_price = $(element).find('.mt-auto > .mb-3 > .flex').text();
      const price_info = $(element).find('.mt-auto').map((index, element) => {
        const info = $(element).find('.mb-2 > div > span').text();   	
        const finalInfo = info.replace(/([ACDEFH-Z])/g, ", $1");

        return {'info': finalInfo}
      })
      return {'name': document_name, 'storage': storage_space, 'monthly': monthly_price, 'price': price_info[0].info}
    }).get();

    return listing;
  }
  async main(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto('https://nordlocker.com/plans/');
    const listing = await this.scrapeListings(page);

    return listing;
  }
}

module.exports = NordLocker;
