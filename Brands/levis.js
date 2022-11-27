const Levis_api = require("express").Router();

const puppeteer = require("puppeteer");

const Levis_link = "https://www.levi.in/search?q=";
const name_selector = "h1.product-name";
const price_selector =
   "#product-content > div.item-price-rating > div.product-price > span.price-sales > span";
const image_selector =
   "#main-image-carousel > ul > li.product-image > img.main-image";
const size_selector =
   "ul > div.size-waist-variation > li.attribute.waist > div.value > div > ul > li > a";

Levis_api.post("/Levis", async (req, res) => {
   const name = await puppeteer
      .launch({ headless: true })
      .then(async (browser) => {
         var data = {};
         let page = await browser.newPage();
         const url = Levis_link + req.body.url + "&lang=en_IN";
         await page.goto(url);
         await page.waitForSelector(name_selector);
         var name = await page.$eval(name_selector, (el) => el.textContent);

         var sizes = await page.$$eval(size_selector, (txt) => {
            return txt.map((x) => x.textContent);
         });

         var price = await page.$eval(price_selector, (el) => el.textContent);

         var images = await page.$$eval(image_selector, (img) => {
            return img.map((x) => x.getAttribute("src").replace(" ", "%20"));
         });

         data.name = name;
         data.price = price;
         data.sizes = sizes;
         data.images = images;
         data.price = price;
         return data;
      });
   res.send(name);
});
module.exports = Levis_api;
