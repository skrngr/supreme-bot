const puppeteer = require("puppeteer");
require("dotenv").config();

const Supreme = require("./Supreme");
const Item = require("./Item");

(async _ => {
  await Supreme.init();
  await Item.load("zkmt62fz1");
  Item.print();
  await Supreme.close();
})();
