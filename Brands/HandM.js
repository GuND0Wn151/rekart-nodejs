const H_and_m_api = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
// const puppeteer = require("puppeteer");
// const browserP = puppeteer.launch({
//    headless: true,
//    args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-gpu",
//       "--disable-dev-shm-usage",
//       '--proxy-server="direct://"',
//       "--proxy-bypass-list=*",
//    ],
// });
const url = "https://www2.hm.com/en_in/productpage.";
H_and_m_api.post("/H_and_M", async (req, res) => {
   h = [];
   console.log(req.body.url);
   axios.get(url + req.body.url + ".html").then((response) => {
      var t =response.data
      var $ = cheerio.load(t);
      const price = $("hm-product-price")
         .find("div")
         .find("span")
         .text();
      $ = cheerio.load(t);
      const image_url = $("div.product-detail-main-image-container")
         .find("img")
         .attr("src");
      const ult_image = $("div.product-detail-main-image-container")
         .find("img")
         .attr("srcset");
      const name = $("section.product-name-price")
         .find("hm-product-name")
         .find("div")
         .find("h1")
         .text();

      $("button[type='button']")
         .find("span")
         .each(function (i, ele) {
            h.push({});
            h[i].range = $(this).find("span").text();
         });
      


      const size = $(".option")
         .find("span")
         .map(function () {
            return $(this).text();
         })
         .get();

      console.log(size);
      const data = {
         images: [image_url],
         name: name,
         size: "h",
         price: "1,999",
      };
      res.send(data);
   });
});

module.exports = H_and_m_api;
