const puppeteer = require('puppeteer');
const path = require('path');


async function hiya(query){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    query.replace(/ \s/g, '+');
    await page.goto(`https://duckduckgo.com/?q=${query}&atb=v100-7&ia=qa.com`);
    await page.screenshot({path: path.join(__dirname, `/images/${query}.png`)});
    await browser.close();

}

exports.hiya = hiya;
