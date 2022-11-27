const Gas_api = require("express").Router();
const pupeteer = require("puppeteer");

const id = "8342065";
const id2 = "8365176";
const Gas_url = "https://www.gasjeans.in/";
const name_selector = "h1.product-title";
const price_selector =
   "#content > div.row.product-info > div.col-sm-5 > ul > li > h2";
const size_selector = "div > div.radio > label.onhover";
const images_selector =
   "div > div > div > div.image-grid-container > div > div > span > img";

Gas_api.post("/Gas", async (req, res) => {
   const name = await pupeteer
      .launch({ headless: true })
      .then(async (browser) => {
         const page = await browser.newPage();
         var data = {};
         await page.goto(Gas_url+req.body.url);
         await page.waitForSelector(name_selector);
         data.name = await page.$eval(name_selector, (el) => el.textContent);
         var temp = await page.$$eval(size_selector, (txt) => {
            return txt.map((x) =>
               x.textContent.replaceAll("\n", "").replaceAll(" ", "")
            );
         });

         data.sizes = temp;

         data.images = await page.$$eval(images_selector, (img) => {
            return img.map((x) => x.getAttribute("src").replaceAll(" ", "%20"));
         });
         data.price = await page.$eval(price_selector, (el) => el.textContent);
         return data;
      });

   res.send(name);
});

module.exports = Gas_api;
