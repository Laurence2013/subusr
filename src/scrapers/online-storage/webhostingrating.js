const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class WebHostingRating {

  async scrapeListings(page){
    const document_name = 'Sync';
    const html = await page.content();
    const $ = cheerio.load(html);

    const listing = await $('.entry-content > div > table').map((i, element) => {
      if(i != 0){
        const td_one = $(element).find('tr > td:nth-child(1)').map((i, elem) => {
          const plan_type = $(elem).find('strong').map((i, elem) => {
            return {'plan_type': $(elem).text()};
          });
          const storage_type = $(elem).find('ul').text().trim();
        
          if(storage_type != ''){
            return {'plan': plan_type[0].plan_type, 'storage': storage_type};
          }
        });
        const td_two = $(element).find('tr > td:nth-child(2)').map((i, elem) => {
          const bill_type = $(elem).find('a').text().trim();
        
          return {'bill': bill_type};
        });
        const myListing = [];
        for(let i = 0; i < td_one.length; i++){
          myListing.push({'td_one': td_one[i], 'td_two': td_two[i]});
        }

        return myListing;
      }
    }).get()

    return listing;
  }
  async main(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto('https://www.websitehostingrating.com/best-dropbox-alternatives/');
    const listing = await this.scrapeListings(page);  
    
    return listing;
  }
}

module.exports = WebHostingRating;
