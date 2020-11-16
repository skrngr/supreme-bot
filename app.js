const puppeteer = require("puppeteer");
require("dotenv").config();
const inquirer = require("inquirer");
const { program } = require("commander");
program.version("0.1.0");

// const Supreme = require("./Supreme");
const Item = require("./Item");
const Store = require("./Store");

const Shirt = new Item();
const Supreme = new Store();

const { SEL_NAME } = process.env;

// const Supreme = {
//   init: async function() {
//     this.browser = await puppeteer.launch({
//       headless: false
//     });
//   }
// };
(async _ => {
  await Supreme.init();
  // const Supreme = await puppeteer.launch({ headless: false });
  // const Supreme = {};
  // Supreme.browser = await puppeteer.launch({ headless: false });
  // const { browser } = await Supreme;
  // console.log(await Supreme.brow?ser);
  Shirt.page = await Supreme.browser.newPage();
  await Shirt.load("shirt", "zkmt62fz1");
  Shirt.print();

  // await Shirt.load("shirt", "zkmt62fz1");
  // await Shirt.print();
  // await Supreme.close();
})();
