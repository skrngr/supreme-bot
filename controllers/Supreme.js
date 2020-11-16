import puppeteer from "puppeteer";

import Item from "../pages/Item.js";

const SupremeContext = {
  watch: [],
  item: null,
  cart: null
};

const SupremeController = {
  init: async _ => {
    SupremeContext.browser = puppeteer.launch({ headless: false });
  },
  query: _ => {
    console.log("hello from the controller!!", SupremeContext.browser);
  },
  watch: {
    add: async () => {
      SupremeContext.watch.push(SupremeContext.item);
      let item = new Item();
      SupremeContext.item = await item.create(SupremeContext.browser.newPage());
    },
    list: () => {
      console.log(SupremeContext.watch);
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
