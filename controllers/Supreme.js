import puppeteer from "puppeteer";

import Item from "../pages/Item.js";

const SupremeContext = {
  watch: [],
  item: null,
  cart: null,
  shop: null
};

const SupremeController = {
  init: async _ => {
    SupremeContext.browser = await puppeteer.launch({ headless: 1 });
    const item = new Item();
    await item.create(await SupremeContext.browser.newPage());
    SupremeContext.item = await item;
  },

  query: {
    code: value => {
      console.log("'query code <code>' command coming soon!");
    },
    type: () => {
      console.log("'query type <term>' command coming soon!");
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
