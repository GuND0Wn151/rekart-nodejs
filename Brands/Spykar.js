const puppeteer = require("puppeteer");
const Spykar_api = require("express").Router();


const Spykar_link = "https://spykar.com/products/" ;
const name_selector = "h1.product_title";
const price_selector = "span.price_varies >ins";
const image_selector = "div.img_ptw";
const size_selector = "div.swatch-button >span";

Spykar_api.post("/Spykar", async (req, res) => {
   const name = await puppeteer
      .launch({ headless: true })
      .then(async (browser) => {
         var data = {};
         let page = await browser.newPage();
         await page.goto(Spykar_link+req.body.url, { waitUntil: "domcontentloaded" });
         //await page.waitForSelector("product-title")
         data.name = await page.$eval(name_selector, (el) => el.textContent);
         data.price = await page.$eval(price_selector, (el) => el.textContent);
         data.size = await page.$$eval(size_selector, (txt) => {
            return txt.map((el) => el.textContent);
         });
         var images = await page.$eval(image_selector, (el) =>
            el.getAttribute("data-bgset")
         );
         data.images = images.split(",").map((el) => el.replace("//", "https://"));

         return data;
      });
   res.send(name);
});

module.exports = Spykar_api;
