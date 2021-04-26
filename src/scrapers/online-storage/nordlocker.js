const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class NordLocker {

  async scrapeListings(page){
    const document_name = 'NordLocker';
    const html = await page.content();
    const $ = cheerio.load(html);

    const getListing = $('.Pricing > .h-full').map((index, element) => {
      const desc = [];
      const audience = '';
      const info = $(element).find('.px-3').text().trim();
      const plan_name = '';
      const yearly_plan = '';
      const user_plan = function(elem){
        const user_type = {'user_type': ''}
        const storage = $(elem).find('.mb-6').map((index, element) => {
            return {'storage': $(element).find('.text-lead').text().trim()};
        })
        return {'user_type': user_type, 'storage': storage[0]};
      }
      const monthly = $(element).find('.mt-auto > .mb-3 > .flex').text().replace('/','').replace('mo','');
      const details_info = $(element).find('.mt-auto').map((index, element) => {
        const info = $(element).find('.mb-2 > .flex > .text-small').map((index, element) => {
          const detail = 'detail_' + index.toString();
          const detail_info = $(element).text().trim();

          return {[detail]: detail_info}
        });
        return info;
      });
      const details = [];
      for(let i = 0; i < details_info[0].length; i++){
        details.push(details_info[0][i]);
      }
      desc.push({
        'audience': audience,
        'user_plan': user_plan(element),
        'monthly': '$' + monthly,
        'info': info,
        'plan_name': plan_name,
        'yearly_plan': yearly_plan,
        'details': details
      });
      return {'name': document_name, 'desc': desc[0]};
    }).get()

    return getListing;
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
