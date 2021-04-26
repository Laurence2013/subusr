const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const sleep = require('../../utils/utils');

class NinetoFiveGoogle {

  async scrapeListings(page){
    const document_name = 'GoogleDrive';
    const html = await page.content();
    const $ = cheerio.load(html);

    const listing = await $('.post-body').map((index, element) => {
      const ul = $(element).find('ul:nth-of-type(2)').map((index, element) => {
        const li = $(element).find('li').map((index, element) => {
          const li = $(element).text();
          const li_split = li.split('–');
      
          return {'storage': li_split[0].trim(), 'price': li_split[1].trim()}
        })
        return li;
      })
      return ul;
    }).get();

    return listing;
  }
  async main(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto('https://9to5google.com/2018/11/14/google-one-rolling-out-uk-canada/');

    const listing = await scrapeListings(page);

    console.log(listing);
  }
}

module.exports = NinetoFiveGoogle;
