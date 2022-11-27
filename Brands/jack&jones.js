const jack_jones_api = require("express").Router();
let puppeteer = require("puppeteer");

const jack_jones_link =
   "https://www.jackjones.in/st-search?q=";
const name_selector = "h1.product-title";
const price_selector = "li.price-new > h2";
const image_selector = "div.image-additional > a";
const size_selector = "div.radio-type-button2 > label:nth-child(2)";

jack_jones_api.post("/Jack&Jones", async (req, res) => {
   const name = await puppeteer
      .launch({ headless: true })
      .then(async (browser) => {
         var data = {};
         let page = await browser.newPage();
         console.log(jack_jones_link+req.body.url)
         await page.goto(jack_jones_link+req.body.url, { waitUntil: "domcontentloaded" });
         var new_url = await page.$eval("div.row > div > div > div > a ",el=>el.getAttribute("href"))
         
         await page.goto(new_url,{waitUntil:"domcontentloaded"})
         data.title = await page.$eval(name_selector, (one) => one.textContent);
         data.price = await page.$eval(
            price_selector,
            (second) => second.textContent
         );
         const sizes = await page.$$eval(size_selector, (third) => {
            return third.map((fourth) => fourth.textContent.trim());
         });
         data.images = await page.$$eval(image_selector, (five) => {
            return five.map((six) => six.getAttribute("href").split(","));
         });
         data.size = Array.from(new Set(sizes));
         return data;
      });
   res.send(name);
});

module.exports = jack_jones_api;
