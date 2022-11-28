const jack_jones_api = require("express").Router();
let puppeteer = require("puppeteer");

const jack_jones_link = "https://www.jackjones.in/st-search?q=";
const name_selector = "h1.product-title";
const price_selector = "li.price-new > h2";
const image_selector = "div.image-additional > a";
const size_selector = "div.radio-type-button2 > label:nth-child(2)";
const href_selector =
   "#search-content > div.st-product > div > div.col-md-9 > div.row.st-row > div > div > div.st-image.st-image-swap-effect > a";
const browserP = puppeteer.launch({
   headless: true,
   args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
jack_jones_api.post("/Jack&Jones",  (req, res) => {
   console.log(req.body.url);
   let page;
   (async () => {
      var data = {};
      let page = await browserP.newPage();
      console.log(jack_jones_link + req.body.url);
      await page.goto(jack_jones_link + req.body.url, {
         waitUntil: "domcontentloaded",
      });
      var url = await page.$eval(href_selector, (el) =>
         el.getAttribute("href")
      );

      await page.goto(url, { waitUntil: "domcontentloaded" });
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
   })()
      .catch((err) => res.sendStatus(500))
      
});

module.exports = jack_jones_api;
