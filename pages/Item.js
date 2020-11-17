// const Supreme = require("./Supreme");
import Page from "./Page.js";

const {
  SEL_NAME,
  SEL_PRICE,
  SEL_DESC,
  SEL_STYLES,
  SUPREME_SHOP,
  ATTR_STYLE_NAME
} = process.env;

// const Item = {
//   load: async (type, code) => {
//     await Supreme.nav("item", code);
//
//     this.name = await Supreme.retrieve("item", SEL_NAME, "text");
//     this.price = await Supreme.retrieve("item", SEL_PRICE, "text");
//     this.desc = await Supreme.retrieve("item", SEL_DESC, "text");
//     this.styles = await Supreme.getStyles();
//   },
//
//   print: _ => {
//     let text = `
// Name:   ${this.name}
// Price:  ${this.price}
// Desc:   ${this.desc}
// Styles:`;
//
//     this.styles.forEach(i => {
//       text += `\n\t${i.name.trim()} has ${i.sizes.length} size(s) in stock`;
//     });
//
//     console.log(text);
//   }
// };

class Item extends Page {
  constructor() {
    // super(page);
    super();
    this.supUrl = SUPREME_SHOP;
  }

  // async create(page) {
  //   return (this.page = await page);
  // }

  async load(type, code) {
    let url = type + "/" + code;
    await this.nav(url);

    this.name = await this.getText(SEL_NAME);
    this.price = await this.getText(SEL_PRICE);
    this.desc = await this.getText(SEL_DESC);
    this.styles = await this.getStyles();
  }

  async getStyles() {
    // let styleButtons = await this.pages.$$(SEL_STYLES);
    //
    // let styles = [];
    //
    // for (let i in styleButtons) {
    //   let btn = styleButtons[i];
    //   await btn.click();
    //   await this.page.waitForTimeout(100);
    //   let sizes = await this.getSizes();
    //   styles.push(
    //     await this.page.$$eval(
    //       btn,
    //       btn,
    //       sizes,
    //       sel => {
    //         return {
    //           name: btn.getAttribute(ATTR_STYLE_NAME),
    //           sizes: [...sizes]
    //         };
    //       },
    //       [btn, sizes, ATTR_STYLE_NAME]
    //     )
    //   );
    // }
    return "styles";
  }

  async getSizes() {
    const sizes = [];
    const options = await this.page.$$eval(SEL_OPTIONS, options => {
      for (let i = 0; i < options.length; i++) {
        sizes.push(options[i].innerText);
      }
    });
  }

  print() {
    console.log(this);
  }

  watch = false;
}

export default Item;
