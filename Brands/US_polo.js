const US_polo_api = require("express").Router();
const pupeteer = require("puppeteer");

const US_polo_link = "https://uspoloassn.nnnow.com/search?q=";
const name_selector = "div.nw-product-name > h1 > span";
const price_selector = "div.nw-priceblock-container > span";
const image_selector = "div.nw-thumbnail-image > div > img";
const size_selector = "div.nw-sizeblock-list > button ";
const browserP = pupeteer.launch({
   headless: true,
   args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
US_polo_api.post("/USpolo",  (req, res) => {
   console.log(req.body.url);
   let page;
   (async () => {
      page = await browser.newPage();

      var data = {};
      await page.goto(US_polo_link + req.body.url);
      let newURL = await page.$eval(
         "div.nw-productlist-eachproduct > a",
         (op) => op.getAttribute("href")
      );
      await page.goto("https://uspoloassn.nnnow.com" + newURL);
      data.name = await page.$eval(name_selector, (op1) => op1.textContent);
      data.price = await page.$eval(price_selector, (op2) => op2.textContent);
      const sizes = await page.$$eval(size_selector, (op3) => {
         return op3.map((op4) => op4.textContent);
      });
      data.images = await page.$$eval(image_selector, (op5) => {
         return op5.map((op6) => op6.getAttribute("src"));
      });
      data.size = Array.from(new Set(sizes));
      res.send(data);
   })()
      .catch((err) => res.sendStatus(500))
      .finally(() => page.close());
});

module.exports = US_polo_api;
