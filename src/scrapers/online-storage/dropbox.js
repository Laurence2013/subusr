const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const sleep = require('../../utils/utils');

class DropBox {
  async scrapeListings(page){
    const document_name = 'DropBox';
    const html = await page.content();
    const $ = cheerio.load(html);

    const listing = await $('.arbor-grid-element').map((index, element) => {
      const yearly_price = '';
      const audience = $(element).find('.segmented-plan-card__audience').text();
      const plan_name = $(element).find('.segmented-plan-card__plan-name').text();
      const monthly = $(element).find('.segmented-plan-card__price').text().substr(0, 6).replace('£','');
      const info = $(element).find('.segmented-plan-card__description').text();
      const user_plan = $(element).find('.segmented-plan-card__base-feature-list').map((index, element) => {
        const user_type = $(element).find('li:nth-child(1) > span').map((index, element) => {
          const user_type = $(element).text().trim();

          return {'user_type': user_type};
        })
        const storage = $(element).find('li:nth-child(2) > span').map((index, element) => {
          const storage_type = $(element).text().trim();

          return {'storage': storage_type};
        })
        return {'user_type': user_type[0], 'storage': storage[0]};
      })
      const devices = $(element).find('.segmented-plan-card__feature-list ').map((index, element) => {
        const details = $(element).find('ul > li').map((index, element) => {
          const detail = 'detail_' + index.toString();
          const li = $(element).text().trim();
              
          return {[detail]: li};
        })
        return details;
      })
      const details = [];
      for(let i = 0; i < devices[0].length; i++){
          details.push(devices[0][i]);
      }
      const desc = [];
      desc.push({'audience': audience, 'plan_name': plan_name, 'monthly': monthly, 'info': info, 'user_plan': user_plan[0], 'details': details, 'yearly_price': yearly_price});

      return {'name': document_name, 'desc': desc[0]};
    }).get()
    
    return listing;
  }
  async main(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto('https://www.dropbox.com/plans');

    const tabBtn = await page.$x("//button[@class='arbor-hamburger-button']")    
    await tabBtn[0].click();

    const plan_price = await page.$x("//a[@class='arbor-nav-menu-button']");

    await plan_price[0].click();
    await sleep(4000);

    const bill_type = await page.$x("//input[@id='schedule_id--MONTHLY']");
    bill_type[0].click();

    await sleep(4000);

    const listing = await this.scrapeListings(page);

    return listing;
  }
}

module.exports = DropBox;
