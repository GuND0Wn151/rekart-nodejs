const United_api = require("express").Router();
const pupeteer = require("puppeteer");

const United_link = "https://in.benetton.com/search?q=";
const name_selector = "h1.product-name ";
const price_selector = "span.sales > span";
const image_selector = "div.carousel-item > a > img";
const size_selector = "ul#size-1-pdp > li > button ";
const browserP = pupeteer.launch({
   headless: true,
   args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
United_api.post("/United",  (req, res) => {
   console.log(req.body.url);
   let page;
   (async () => {
      page = await (await browserP).newPage();
      var data = {};
      await page.goto(United_link + req.body.url, {
         waitUntil: "domcontentloaded",
      });
      let newURL = await page.$eval("div.product-detail-image      > a", (op) =>
         op.getAttribute("href")
      );
      await page.goto("https://in.benetton.com/" + newURL);
      console.log("https://in.benetton.com/" + newURL);
      data.name = await page.$eval(name_selector, (op1) => op1.textContent);
      data.price = await page.$eval(price_selector, (op2) => op2.textContent);
      const sizes = await page.$$eval(size_selector, (op3) => {
         return op3.map((op4) => op4.textContent);
      });
      data.images = await page.$eval(image_selector, (op5) =>
         op5.getAttribute("srcset").split(",")
      );

      data.size = Array.from(new Set(sizes));
      res.send(data);
   })()
      .catch((err) => res.send(err))
      
});

module.exports = United_api;
