const Lee_api = require("express").Router();
const pupeteer = require("puppeteer");
const Lee_link = "https://www.lee.in/";
const name_selector = "span.base";
const price_selector = "span.price";
const image_selector = "div.fotorama__nav__frame > div >img";
const size_selector = "div.swatch-option";

Lee_api.post("/Lee", async (req, res) => {
   const name = await pupeteer
      .launch({ headless: true })
      .then(async (browser) => {
         const page = await browser.newPage();
         var data = {};
         await page.goto(Lee_link,{waitUntil:"domcontentloaded"});
         await page.click("#search")
         await page.keyboard.type("LMSH002239")
         await page.click("button.amsearch-loupe")
         await page.waitForNavigation()
         data.title = await page.$eval(name_selector, (op1) => op1.textContent);
         data.price = await page.$eval(
            price_selector,
            (op2) => op2.textContent
         );
         data.sizes = await page.$$eval(size_selector, (op3) => {
            return op3.map((op4) => op4.textContent);
         });
         data.images = await page.$$eval(image_selector, (op5) => {
            return op5.map((op6) => op6.getAttribute("src"));
         });
         data.size = Array.from(new Set(data.sizes));
         return data;
      });

   res.send(name);
});

module.exports = Lee_api;
