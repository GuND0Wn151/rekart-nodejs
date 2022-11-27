const Calvin_api = require("express").Router();
const puppeteer = require("puppeteer");

const Calvin_link = "https://calvinklein.nnnow.com/search?q=";
const name_selector = "span.nw-product-title.nw-product-titletxt";
const price_selector = "div.nw-priceblock-container > span.nw-priceblock-amt";
const image_selector =
   "div.nwc-lazyimg-container.nw-thumbnail-imagelazy.is-loaded> img";
const size_selector =
   "div.nw-sizeblock-list.nwc-custom-scrollbar > button.nwc-btn.nw-size-chip";
const browserP = puppeteer.launch({
   headless: true,
   args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
Calvin_api.post("/Calvin", async (req, res) => {
   console.log(req.body.url);
   let page;
   (async () => {
      page = await browserP.newPage();

      await page.goto(Calvin_link + req.body.url);
      let newURL = await page.$eval(
         "div.nwc-grid-col.nwc-grid-col-xs-6.nwc-grid-col-sm-4.nw-productlist-eachproduct > a",
         (op) => op.getAttribute("href")
      );
      var data = {};
      await page.goto("https://calvinklein.nnnow.com" + newURL);
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
      data.images = await page.$$eval(image_selector, (op5) => {
         return op5.map((op6) => op6.getAttribute("src"));
      });
      data.size = Array.from(new Set(sizes));
      res.send(data);
   })()
      .catch((err) => res.sendStatus(500))
      .finally(() => page.close());
});

module.exports = Calvin_api;
