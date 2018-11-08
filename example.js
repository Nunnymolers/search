const puppeteer = require('puppeteer');
const path = require('path');


async function getContents(r){
  return r.map(e => e.href)
            .filter(e => !e.startsWith('http://duckduckgo'))
            .map(e => `<a href='${e}' target='_blank'>${e}</a> `)
}

async function hiya(query){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    query.replace(/ \s/g, '+');
    await page.goto(`https://duckduckgo.com/?q=${query}`);
    await page.screenshot({path: path.join(__dirname, `/images/${query}.png`)});
    await page.waitForSelector('#links');
    var results = await page.$$eval('.result__a', getContents);
    return results;
}
exports.hiya = hiya;
