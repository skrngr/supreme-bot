const puppeteer = require("puppeteer");
require("dotenv").config();
const inquirer = require("inquirer");
const { program } = require("commander");
program.version("0.1.0");

const Supreme = require("./Supreme");
const Item = require("./Item");

(async _ => {
  await Supreme.init();
  let Shirt = await Item.create();
  // await Shirt.load("shirt", "zkmt62fz1");
  // await Shirt.print();
  // await Supreme.close();
})();
