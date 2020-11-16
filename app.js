const puppeteer = require("puppeteer");
require("dotenv").config();
const inquirer = require("inquirer");
const { program } = require("commander");
program.version("0.1.0");

const Supreme = require("./Supreme");
const Item = require("./Item");

(async _ => {
  await Supreme.init();
  await Item.load("shirt", "zkmt62fz1");
  Item.print();
  await Supreme.close();
})();
