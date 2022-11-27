const wrangler_api = require("express").Router();
let puppeteer = require("puppeteer");

const wrangler_link = "https://www.wrangler.in/";
const name_selector = "h1.page-title > span";
const price_selector = "span.price-wrapper >span";
const image_selector =
   "div.fotorama__stage__frame.fotorama_vertical_ratio.fotorama__loaded.fotorama__loaded--img >img";
const size_selector = "div.swatch-option.text";
const browserP = puppeteer.launch({
   headless: true,
   args: [
         '--no-sandbox',
         '--disable-setuid-sandbox',
         '--disable-gpu',
         '--disable-dev-shm-usage',
         '--proxy-server="direct://"',
         '--proxy-bypass-list=*'
    ]
});

wrangler_api.post("/Wrangler",  (req, res) => {
   console.log(req.body.url);
   let page;
   (async () => {
      var data = {};
      page = await browserP.newPage();
      await page.goto(wrangler_link, { waitUntil: "domcontentloaded" });
      await page.click("#search");
      await page.keyboard.type(req.body.url);
      await page.click("button.action");
      await page.waitForNavigation();
      await page.waitForSelector(
         "div.fotorama__stage__frame.fotorama_vertical_ratio.fotorama__loaded.fotorama__loaded--img"
      );
      data.name = await page.$eval(name_selector, (el) => el.textContent);
      data.price = await page.$eval(price_selector, (el) => el.textContent);
      data.images = await page.$$eval(image_selector, (img) => {
         return img.map((x) => x.src);
      });
      data.sizes = await page.$$eval(size_selector, (txt) => {
         return txt.map((x) => x.textContent);
      });
      res.send(data);
   })()
      .catch((err) => res.sendStatus(500))
      .finally(() => page.close());
});

module.exports = wrangler_api;
