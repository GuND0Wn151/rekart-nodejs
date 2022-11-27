const Blackberrys_api = require("express").Router();
const pupeteer = require("puppeteer");

const Blackberrys_link = "https://blackberrys.com/search?q=89051259273212";
const name_selector = "div.product-details > h5 ";
const price_selector = "h6.product-details__price";
const image_selector = "div.desktop-product-gallery > div > div > div >span >img";
const size_selector = "ul.swatch__list_pr > li >span";

Blackberrys_api.post("/blackberrys", async (req, res) => {
   const name = await pupeteer
      .launch({ headless: true })
      .then(async (browser) => {
         const page = await browser.newPage();

         var data = {};
         await page.goto(Blackberrys_link);
         let newURL = await page.$eval(
            "div.st-shop-thumbnail-wrap > a",
            (op) => op.getAttribute("href")
         );
         await page.goto(newURL);
         data.title = await page.$eval(name_selector, (op1) => op1.textContent.trim());
         data.price = await page.$eval(
            price_selector,
            (op2) => op2.textContent
         );
         const sizes = await page.$$eval(size_selector, (op3) => {
            return op3.map((op4) => op4.textContent);
         });
         data.images = await page.$$eval(image_selector,(img)=>{
            return img.map((src)=>src.getAttribute("src"))
         } )
            
         data.size = Array.from(new Set(sizes));
         return data;
      });

   res.send(name);
});

module.exports = Blackberrys_api;
