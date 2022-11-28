const puppeteer = require("puppeteer");
const Spykar_api = require("express").Router();

const Spykar_link = "https://spykar.com/products/";
const name_selector = "h1.product_title";
const price_selector = "span.price_varies >ins";
const image_selector = "div.img_ptw";
const size_selector = "div.swatch-button >span";
const browserP = puppeteer.launch({
   headless: true,
   args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
Spykar_api.post("/Spykar", (req, res) => {
   console.log(req.body.url);
   let page;
   (async () => {
      var data = {};
      page = await browserP.newPage();
      await page.goto(Spykar_link + req.body.url, {
         waitUntil: "domcontentloaded",
      });
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

      res.send(data);
   })()
      .catch((err) => res.sendStatus(500))
      
});

module.exports = Spykar_api;
