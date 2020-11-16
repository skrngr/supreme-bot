import puppeteer from "puppeteer";

import Item from "../pages/Item.js";

const SupremeContext = {
  watch: [],
  item: null,
  cart: null
};

const SupremeController = {
  init: async _ => {
    SupremeContext.browser = await puppeteer.launch({ headless: false });
    const item = new Item(0);
    await item.create(await SupremeContext.browser.newPage());
    SupremeContext.item = await item;
  },

  query: _ => {
    console.log("hello from the controller!!", SupremeContext.browser);
  },

  watch: {
    add: async () => {
      SupremeContext.item.watch = true;
      SupremeContext.watch.push(await SupremeContext.item);
      let item = new Item();
      await item.create(await SupremeContext.browser.newPage());
      SupremeContext.item = await item;
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
