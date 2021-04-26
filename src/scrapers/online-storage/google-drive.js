const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class GoogleDrive {

  async scrapeListings(page){
    const document_name = 'GoogleDrive';
    const html = await page.content();
    const $ = cheerio.load(html);

    const getListing = $('.CzTxdd').map((index, element) => {
      if(index >= 7){ return; }

      const listing = [];
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

      if(yearly_price.length >= 20){
        const yrly_price_fix = yearly_price.substring(13, 26).replace('£','').split(' ')[0];
        listing.push({'yearly_price': yrly_price_fix});
      }
      listing.push({'user_plan': user_plan(element)});

      if(plan_name.length != 0){
        listing.push({'plan_name': plan_name[0].type});
      }else{
        listing.push({'plan_name': ''});
      }
      try {
        const price = monthly[0].price.replace('£','').split(' ')[0];
        listing.push({'monthly': price});
      }catch(error){
        listing.push({'monthly': ''});
      }
      listing.push({'audience': audience});
      listing.push({'info': info});

      return {'name': document_name, 'desc': listing};
    }).get()

    for(let i = 0; i < getListing.length; i++){
      const detail_info = $('.hxvKGd').map((index, element) => {
        const span = $(element).map((index, element) => {
          return ($(element).find('ul > li').map((index, element) => {
            const span = $(element).find('span:nth-child(2)').text().trim();

            return {'detail': span};
          }));
        });
        return span[0];
        });
        const details = [];

        for(let j = 0; j < detail_info[i].length; j++){
          const detail = 'detail_' + [j].toString();

          details.push({[detail]: detail_info[i][j].detail});
        }
        getListing[i].desc.push({'details': details});
    }
    return getListing;

    /*const getListing = $('.CzTxdd').map((index, element) => {
      const listing = [];
      const storage = $(element).find('.Qnu87d').map((index, element) => { return {'storage': $(element).text().trim()} })
      const type = $(element).find('.tKV7vb').map((index, element) => { return {'type': $(element).find('span').text().trim()} })
      const price_type = $(element).find('.VfPpkd-vQzf8d').map((index, element) => { return {'price': $(element).find('div > span').text().trim()} })
      const yrly_price = $(element).find('.VfPpkd-vQzf8d').text().trim()

      if(yrly_price.length >= 20) {
        const yrly_price_fix = yrly_price.substring(13, 26)
        listing.push({'yearly_price': yrly_price_fix})
      }
      listing.push({'storage': storage[0].storage})

      if(type.length != 0){
          listing.push({'type': type[0].type})
      }

      try {
          listing.push({'monthly': price_type[0].price})
      }catch(error){
          listing.push({'monthly': ''})
      }
      return {'name': document_name, 'desc': listing}
    }).get()

    for(let i = 0; i < getListing.length; i++){
      const detail_info = $('.hxvKGd').map((index, element) => {
        const span = $(element).map((index, element) => {
          return ($(element).find('ul > li').map((index, element) => {
            const span = $(element).find('span:nth-child(2)').text().trim();
       
            return {'detail': span}
          }))
        })
        return span[0]
      })
      for(let j = 0; j < detail_info[i].length; j++){
        const detail = 'detail_' + [j].toString()
        getListing[i].desc.push({[detail]: detail_info[i][j].detail})
      }
    }
    for(let k = 0; k < getListing.length; k++){
      console.log(getListing[k])
    }*/
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
