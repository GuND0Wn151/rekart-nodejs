const Gas_api = require("express").Router();
const pupeteer = require("puppeteer");

const Gas_url = "https://www.gasjeans.in/";
const name_selector = "h1.product-title";
const price_selector =
   "#content > div.row.product-info > div.col-sm-5 > ul > li > h2";
const size_selector = "div > div.radio > label.onhover";
const images_selector =
   "div > div > div > div.image-grid-container > div > div > span > img";
const browserP = pupeteer.launch({
   headless: true,
   args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
Gas_api.post("/Gas",  (req, res) => {
   let page;
   (async () => {
      page = await browserP.newPage();
      var data = {};
      await page.goto(Gas_url + req.body.url);
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
      res.send(data);
   })()
      .catch((err) => res.sendStatus(500))
      .finally(() => page.close());
});

module.exports = Gas_api;
