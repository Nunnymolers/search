var datamodel = require('./dataschema.js').getModel();
const puppeteer = require('puppeteer');
const path = require('path');
let browser;

async function startBrowser() {
    browser = await puppeteer.launch({args: ['--no-sandbox']});
}


async function getContents(r){
  return r.filter(e => !e.href.startsWith('https://duckduckgo'))
            .map(e => {
                return {
                  link: `<a href='${e.href}' target='_blank'>${e.innerHTML}</a> `
                  , title: e.innerText
                  , contents: ''
                  , url: e.href
                }
            })
}

async function searchScrape(query){
    if(!browser) return;
    const page = await browser.newPage();
    query.replace(/ \s/g, '+');
    await page.goto(`https://duckduckgo.com/?q=${query}`);
    await page.waitForSelector('#links');
    var results = await page.$$eval('.result__a', getContents);
    results.forEach(r => {
      var data = new datamodel(r);
      data.save();
    })
    // for(i=0; i<results.length; i++){
    //   var contents = await scrapeContents(page, results[i].url)
    //   results[i].contents = contents;
    // }
    return results;
}

// async function scrapeContents(page, url) {
//   await page.goto(url)
//   await page.waitForSelector('html')
//   try{
//     const result = await page.evaluate(() => {
//       return document.querySelector('html').innerHTML;
//     })
//     return result;
//   }
//   catch(ex){
//     console.log(url)
//     return '';
//   }
// }

startBrowser();

exports.searchScrape = searchScrape;
