const Tommy_api = require("express").Router();

let puppeteer = require("puppeteer");
const tommy_link = "https://tommyhilfiger.nnnow.com";
const name_selector = "div.nw-productview-producttitle";
const price_selector = "span.nw-priceblock-amt";
const image_selector = "div.nw-thumbnail-image > div > img";
const size_selector = "button.nw-size-chip ";

Tommy_api.post("/tommy", async (req, res) => {
   const name = await puppeteer
      .launch({ headless: true })
      .then(async (browser) => {
         var data = {};
         let page = await browser.newPage();
         await page.goto(
            "https://tommyhilfiger.nnnow.com/search?q=" + "A2AMK437",
            { waitUntil: "domcontentloaded" }
         );
         await page.waitForSelector("a.nw-productview");
         var title = await page.$eval(
            name_selector,
            (el) => el.textContent
         );
         var link = await page.$eval("a.nw-productview", (el) =>
            el.getAttribute("href")
         );

         await page.goto(tommy_link + link, { waitUntil: "domcontentloaded" });
         await page.waitForNavigation();
         var price = await page.$eval(price_selector, (el) => el.textContent);

         var size = await page.$$eval(size_selector, (txt) => {
            return txt.map((x) => x.textContent.replace("\r", "\n"));
         });
         var images = await page.$$eval(image_selector, (img) => {
            return img.map((x) => x.getAttribute("src"));
         });
         data.title = tommy_link + link;
         data.price = price;
         data.sizes = size;
         data.images = images;
         return data;
      });
   res.send(name);
});

module.exports = Tommy_api;
