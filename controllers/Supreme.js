import puppeteer from "puppeteer";

import Item from "../pages/Item.js";
import Store from "../pages/Store.js";

let HEADLESS = parseInt(process.env.HEADLESS);

const SupremeContext = {
  watch: [], // array of item pages currently being watched
  cart: null, // cart page class
  store: new Store() // shop page class
};

const SupremeController = {
  init: async _ => {
    SupremeContext.browser = await puppeteer.launch({
      headless: HEADLESS,
      slowMo: 10
    });
    await SupremeContext.store.create(
      await SupremeContext.browser.newPage(),
      1,
      1
    );
    return await SupremeContext.store.load("all", 1);
  },

  newPage: async () => {
    return await SupremeContext.browser.newPage();
  },

  query: {
    code: value => {
      console.log("'query code <code>' command coming soon!");
    },
    category: () => {
      console.log("'query category <term>' command coming soon!");
    }
  },

  watch: {
    add: async () => {
      SupremeContext.item.watch = true;
      SupremeContext.watch.push(await SupremeContext.item);
      let item = new Item();
      await item.create(await SupremeContext.browser.newPage());
      SupremeContext.item = await item;
      console.log(await "item added to watch list!");
    },
    list: async () => {
      let list = await SupremeContext.watch;
    }
  },

  cart: {
    list: () => {
      console.log("*cart listing*");
    },
    add: () => {
      console.log("item added");
    },
    remove: () => {
      console.log("item removed");
    }
  },

  store: {
    refresh: async () => {
      // console.log("you've hit the controller!!!!!");
      // .load() needs to be turned into a method for updating
      // the inventory
      await SupremeContext.store.load("all", 0);
    },
    restock: async () => {
      console.log("you've hit the controller!!!!!");
      await SupremeContext.store.load("all", 1);
      // SupremeContext.shop.load("all", 1);
    }
  },

  close: async () => SupremeContext.browser.close()
};

export { SupremeContext as Context, SupremeController as Controller };
