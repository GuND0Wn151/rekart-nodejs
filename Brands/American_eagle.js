const American_eagle_api = require("express").Router();
const pupeteer = require("puppeteer");

const American_eagle_link =
   "https://www.aeo.in/search?search_query=WEC0155790395";
const name_selector = "div.product__details > h1";
const price_selector = "div.product__details--price > span";
const image_selector = "div.slick-slide > div > img";
const size_selector = "div.mCSB_1_container >li > a";
const browserP = pupeteer.launch({
   args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

American_eagle_api.post("/a-eagle", (req, res) => {
   let page;
   (async () => {
      page = await (await browserP).newPage();
      var data = {};
      await page.goto(American_eagle_link, { waitUntil: "domcontentloaded" });
      var x = await page.$eval("a.spriteIcon", (el) => el.getAttribute("href"));
      console.log(x);
      let newURL = await page.$eval(
         "div.product__info > span",
         (op) => op.textContent
      );
      console.log(newURL);
      await page.goto(newURL);
      data.title = await page.$eval(name_selector, (op1) => op1.textContent);
      data.price = await page.$eval(price_selector, (op2) => op2.textContent);
      const sizes = await page.$$eval(size_selector, (op3) => {
         return op3.map((op4) => op4.textContent);
      });
      data.images = await page.$$eval(image_selector, (op5) => {
         return op5.map((op6) => op6.getAttribute("src"));
      });
      data.size = Array.from(new Set(sizes));
      res.send(data)
   })()
      .catch((err) => res.sendStatus(500))
      .finally(() => page.close());
});

module.exports = American_eagle_api;
