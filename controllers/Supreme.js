import puppeteer from "puppeteer";

import Item from "../pages/Item.js";
import Store from "../pages/Store.js";
import Category from "../pages/Category.js";

let HEADLESS = parseInt(process.env.HEADLESS);

const supCategories = {
  jackets: new Category(),
  shirts: new Category(),
  tops: new Category(),
  sweatshirts: new Category(),
  pants: new Category(),
  shorts: new Category(),
  hats: new Category(),
  bags: new Category(),
  accessories: new Category(),
  shoes: new Category(),
  skate: new Category()
};

const SupremeContext = {
  watch: [], // array of item pages currently being watched
  item: new Item(), // current item in view (item page class)
  cart: null, // cart page class
  store: new Store(supCategories) // shop page class
};

const SupremeController = {
  init: async _ => {
    SupremeContext.browser = await puppeteer.launch({ headless: HEADLESS });
    await SupremeContext.item.create(await SupremeContext.browser.newPage());
    await SupremeContext.store.create(await SupremeContext.browser.newPage());
    await SupremeContext.store.load("all", 0);
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
      for (let i = 0; i < list.length; i++) {
        // list[i].hasOwnProperty("emitter")
        //   ? console.log(list[i].emitter)
        //   : console.log("blank page");
        console.log(list[i].watch);
      }
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
      console.log("you've hit the controller!!!!!");
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

// const Supreme = {
//   init: async function() {
//     this.browser = await puppeteer.launch({
//       headless: false
//       // args: ["--start-fullscreen"]
//     });
//   },
//
//   context: {
//     watch: [],
//     cart: {
//       items: null
//     }
//   },
//
//   pages: {
//     item: null,
//     cart: null,
//     watch: []
//   },
//

//
//   name: "g",
//
//
// };

export { SupremeContext as Context, SupremeController as Controller };
