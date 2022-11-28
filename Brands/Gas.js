const Gas_api = require("express").Router();
const pupeteer = require("puppeteer");

const Gas_url = "https://www.ajio.com/search/?text=";
const name_selector = "h1.prod-name";
const price_selector =
   "div.prod-sp";
const size_selector = "div.circle > span";;
const images_selector =
   "div.img-container > img";
const browserP = pupeteer.launch({
   headless: true,
   args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

Gas_api.post("/Gas",  (req, res) => {
   let page;
   (async () => {
      page = await (await browserP).newPage();
      var data = {};
      await page.goto(Gas_url + req.body.url);
      await page.waitForSelector(name_selector);
      data.name = await page.$eval(name_selector, (el) => el.textContent);
      var temp = await page.$$eval(size_selector, (txt) => {
         return txt.map((x) =>
            x.textContent
         );
      });

      data.sizes = temp;

      data.images = await page.$$eval(images_selector, (img) => {
         return img.map((x) => x.getAttribute("src").replaceAll(" ", "%20"));
      });
      data.price = await page.$eval(price_selector, (el) => el.textContent);
      console.log(data)
      res.send(data);
   })()
      .catch((err) => res.send(err))
     
});

module.exports = Gas_api;
