var datamodel = require('./dataschema.js').getModel();
const puppeteer = require('puppeteer');
const path = require('path');
let browser;

var mongoose = require('mongoose');
var dbAddress = process.env.MONGODB_URI || 'mongodb://127.0.0.1/search';

/*
TODOS:
grab the LINKS from database that have no contents
go to links from database and scrape contents
update database with new contents


*/

async function startBrowser() {
    browser = await puppeteer.launch({args: ['--no-sandbox']});
}

function grabLinks(){
    datamodel.find({contents: ''}, async function(err, links){
      await startBrowser();
      await goToLinks(links);
    })

}

async function goToLinks(links){
  const page = await browser.newPage();
  for(var i=0; i<links.length; i++){
    try{
      var contents = await scrapeContents(page, links[i].url)
      links[i].contents = contents;
      updateDatabase(links[i]);
    }
    catch(ex){
      contents = ''
    }
  }
  mongoose.disconnect()
  process.exit()
}

async function scrapeContents(page, url) {
  await page.goto(url)
  await page.waitForSelector('html')
  try{
    const result = await page.evaluate(() => {
      return document.querySelector('html').innerHTML;
    })
    return result;
  }
  catch(ex){
    console.log(url)
    return '';
  }
}

function updateDatabase(link){
  link.save()
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
    for(i=0; i<results.length; i++){
      var contents = await scrapeContents(page, results[i].url)
      results[i].contents = contents;
    }
    return results;
}


mongoose.connect(dbAddress, grabLinks)
// startBrowser();
