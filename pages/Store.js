const puppeteer = require("puppeteer");

const {
  VP_WIDTH,
  VP_HEIGHT,
  SUPREME_SHOP,
  SUPREME_CART,
  SEL_OPTION,
  SEL_DETAILS,
  SEL_STYLES
} = process.env;

class Store {
  // browser: null,
  // page: null,

  // init = async _ => {
  //   this.browser = await puppeteer.launch({
  //     headless: false
  //     // args: ["--start-fullscreen"]
  //   });
  // };

  // this.pages = {
  //   cart: await this.browser.newPage(),
  //   watch: await this.browser.newPage(), // for watching items later on
  //   item: await this.browser.newPage()
  // };

  // setVP: _ => {
  //   for (let i in this.pages) {
  //     this.pages[i].setViewport({
  //       width: parseInt(VP_WIDTH),
  //       height: parseInt(VP_HEIGHT)
  //     });
  //   }
  // },

  // nav: async (page, url) => {
  //   switch (page) {
  //     case "item":
  //       await this.pages.item.goto(SUPREME_SHOP + url, {
  //         waitUntil: "networkidle2"
  //       });
  //       await this.pages.item.waitForSelector(SEL_DETAILS);
  //       break;
  //     case "cart":
  //       await this.pages.cart.goto(SUPREME_CART, {
  //         waitUntil: "networkidle2"
  //       });
  //       break;
  //     case "watch":
  //       await this.pages.watch.goto(SUPREME_SHOP + url, {
  //         waitUntil: "networkidle2"
  //       });
  //       break;
  //   }
  // },

  close = async _ => await this.browser.close();

  // retrieve: (page, selector, retrieve) => {
  //   switch (page) {
  //     case "item":
  //       page = this.pages.item;
  //       break;
  //   }
  //
  //   switch (retrieve) {
  //     case "text":
  //       return page.$eval(selector, el => el.innerText);
  //       break;
  //     case "nodes":
  //       return page.$$(SEL_STYLES);
  //     default:
  //       return page.$(selector);
  //       break;
  //   }
  // },

  // getStyles: async _ => {
  //   let styleButtons = await this.pages.item.$$(SEL_STYLES);
  //
  //   await this.pages.item.evaluate(SEL_OPTION => {
  //     window.getSizes = () => {
  //       const sizes = [];
  //       const options = document.querySelectorAll("#s>option");
  //       for (let i = 0; i < options.length; i++) {
  //         sizes.push(options[i].innerText);
  //       }
  //       return sizes;
  //     };
  //   });
  //
  //   let styles = [];
  //
  //   for (let i in styleButtons) {
  //     let btn = styleButtons[i];
  //     await btn.click();
  //     await this.pages.item.waitForTimeout(100);
  //     styles.push(
  //       await this.pages.item.evaluate(btn => {
  //         return {
  //           name: btn.getAttribute("data-style-name"),
  //           sizes: [...getSizes()]
  //         };
  //       }, btn)
  //     );
  //   }
  //
  //   return styles;
  // }
}

module.exports = Store;
