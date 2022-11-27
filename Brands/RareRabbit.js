const RareRabbit_api = require("express").Router();
const puppeteer = require("puppeteer");

const RareRabbit_link = "https://thehouseofrare.com/search?q=" ;
const href_selector =
    "div > div > div > div.st-shop-thumbnail-wrap.ProductItem__img_block > a";
const name_selector =
   "div.Product__Info > div > div.ProductMeta > div.title-name-and-wishlist > h6";
const price_selector = "span.money";
const sizes_selector =
   "div.ProductForm__Variants > div:nth-child(1) > ul > li > label";
const images_selector = "div > div > div > span > img";
const browserP = puppeteer.launch({
   headless: true,
   args: ["--no-sandbox", "--disable-setuid-sandbox"],
});


RareRabbit_api.post("/RareRabbit", async (req, res) => {
   console.log(req.body.url);
   let page;
   (async () => {
         var data = {};
         page = await browserP.newPage();
         data = {};
         await page.goto(RareRabbit_link+req.body.url);
         await page.waitForSelector(href_selector);
         var url = await page.$eval(href_selector, (el) =>
            el.getAttribute("href")
         );
         await page.goto(url);
         await page.waitForSelector(price_selector);
         data.price = await page.$eval(price_selector, (el) => el.textContent);

         data.sizes = await page.$$eval(sizes_selector, (txt) => {
            return txt.map((x) => x.textContent);
         });
         data.images = await page.$$eval(images_selector, (img) => {
            return img.map((x) => "https://"+x.getAttribute("src").slice(2));
         });

         data.name = await page.$eval(name_selector, (el) => el.textContent);
         res.send(data)
      })().catch((err) => res.sendStatus(500))
      .finally(() => page.close());

});

module.exports = RareRabbit_api;
