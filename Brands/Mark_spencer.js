const Mark_spencer_api = require("express").Router();
const pupeteer = require("puppeteer");


const url = "https://www.marksandspencer.in/search?q=";
const name_selector = "div.product-name";
const price_selector = "span.list-pricecolour > span";
const size_selector =
   "div.colour-swatcher > div.col-sm-12.size-drop.px-0 > select > option";
const images_selector =
   "div.swiper-slide > img.product-carousel__thubnail--product-image";

Mark_spencer_api.post("/Markspencer", async (req, res) => {
   const name = await pupeteer.launch().then(async (browser) => {
      const page = await browser.newPage();
      var data = {};

      await page.goto(url+req.body.url+ "&lang=en_IN");

      await page.waitForSelector(name_selector);
      data.name = await page.$eval(name_selector, (el) => el.textContent.replace("\n",""));
      data.sizes = await page.$$eval(size_selector, (txt) => {
         return txt.map((x) => x.textContent.replace("\n",""));
      });

      data.images = await page.$$eval(images_selector, (img) => {
         return img.map((x) => x.getAttribute("src").replace(" ", "%20"));
      });
      data.price = await page.$eval(price_selector, (el) => el.textContent);
      return data

   });
   res.send(name)
});


module.exports = Mark_spencer_api;
