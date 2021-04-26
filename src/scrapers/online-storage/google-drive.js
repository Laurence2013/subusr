const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class GoogleDrive {

  async scrapeListings(page){
    const document_name = 'GoogleDrive';
    const html = await page.content();
    const $ = cheerio.load(html);

    const getListing = $('.CzTxdd').map((index, element) => {
      if(index >= 7){ return; }

      const desc = [];
      const audience = '';
      const info = '';
      const user_plan = function(element){
        const user_type = {'user_type': ''};
        const storage = $(element).find('.Qnu87d').map((index, element) => { return {'storage': $(element).text().trim()} });
 
        return {'user_type': user_type,'storage': storage[0]};
      }
      const plan_name = $(element).find('.tKV7vb').map((index, element) => { return {'type': $(element).find('span').text().trim()} });
      const monthly = $(element).find('.VfPpkd-vQzf8d').map((index, element) => { return {'price': $(element).find('div > span').text().trim()} });
      const yearly_price = $(element).find('.VfPpkd-vQzf8d').text().trim();

      const yrly_price = function(yearly_price){
        if(yearly_price.length >= 20){
          const yrly_price_fix = yearly_price.substring(13, 26).replace('£','').split(' ')[0];

          return {'yearly_price': yrly_price_fix};
        } else {
          return {'yearly_price': ''}
        }
      }
      const plan = function(plan_name){
        if(plan_name.length != 0){
          return {'plan_name': plan_name[0].type};
        }else{
          return {'plan_name': ''};
        }
      }
      const mnth_price = function(monthly){
        try {
          const price = monthly[0].price.replace('£','').split(' ')[0];
          return {'monthly': price};
        }catch(error){
          return {'monthly': ''};
        }
      }
      desc.push({
        'audience': audience, 
        'plan_name': plan(plan_name).plan_name, 
        'monthly': mnth_price(monthly).monthly, 
        'info': info, 
        'user_plan': user_plan(element), 
        'yearly_price': yrly_price(yearly_price).yearly_price
      });
      return {'name': document_name, 'desc': desc[0]};
    }).get()

    for(let i = 0; i < getListing.length; i++){
      const detail_info = $('.hxvKGd').map((index, element) => {
        const span = $(element).map((index, element) => {
          return ($(element).find('ul > li').map((index, element) => {
            const span = $(element).find('span:nth-child(2)').text().trim();
               
            return {'detail': span};
          }))
        })
        return span[0];
      });
      const details = [];

      for(let j = 0; j < detail_info[i].length; j++){
        const detail = 'detail_' + [j].toString();
        
        details.push({[detail]: detail_info[i][j].detail});
      }
      getListing[i].desc.details = details;
    }
    return getListing;
  }
  async main(){
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage();

    await page.goto('https://one.google.com/about/plans');
    const listing = await this.scrapeListings(page);

    return listing;
  }
}

module.exports = GoogleDrive;
