const Diesel_api = require("express").Router();
const pupeteer = require("puppeteer");
const Diesel_link = "https://www.dieselindia.com/search?q=";
const name_selector = "div.product-content > h1";
const price_selector = "p.p-price > span";
const image_selector =
   "div > div.min-page-height > div.main-container > div > div > div > div > div > div > div > div > div > a > div > div > img:nth-child(2)";
const size_selector = "ul.swatch-attribute-values > li > span";
const browserP = pupeteer.launch({
   headless: true,
   args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

Diesel_api.post("/Diesel", (req, res) => {
   console.log(req.body.url);
   let page;
   (async () => {
      page = await (await browserP).newPage();
      var data = {};
      await page.goto(Diesel_link + req.body.url);
      let newURL = await page.$eval("div.title-body > a", (op) =>
         op.getAttribute("href")
      );
      await page.goto("https://www.dieselindia.com" + newURL);
      data.name = await page.$eval(name_selector, (op1) =>
         op1.textContent.trim()
      );
      data.price = await page.$eval(
         price_selector,
         (op2) =>
            op2.textContent.replace("              ", " ").trim().split(" ")[1]
      );
      const sizes = await page.$$eval(size_selector, (op3) => {
         return op3.map((op4) => op4.textContent.trim());
      });
      var images = await page.$$eval(image_selector, (op5) => {
         return op5.map((op6) => op6.getAttribute("src"));
      });
      data.images = Array.from(new Set(images));
      data.size = Array.from(new Set(sizes));
      res.send(data);
   })()
      .catch((err) => res.send(err))
      
});

module.exports = Diesel_api;
