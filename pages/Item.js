// const Supreme = require("./Supreme");
import Page from "./Page.js";

const {
  SEL_NAME,
  SEL_PRICE,
  SEL_DESC,
  SEL_STYLES,
  SUPREME_SHOP,
  ATTR_STYLE_NAME,
  SEL_OPTIONS
} = process.env;

class Item extends Page {
  constructor(name, code, type, styles, price, desc) {
    // super(page);
    super();
    this.supUrl = SUPREME_SHOP;
  }

  async getStyles() {
    let styleButtons = await this.page.$$(SEL_STYLES);

    let styles = [];

    if (styleButtons) {
      for (let i = 0; i < styleButtons.length; i++) {
        let btn = await styleButtons[i];
        await btn.click();
        await this.timeout(100);
        let sizes = await this.getTexts(SEL_OPTIONS);

        let style = await this.page.evaluate(btn => {
          return {
            name: btn.getAttribute("data-style-name")
          };
        }, btn);

        style.sizes = [...sizes];
        styles.push(style);
      }
      return styles;
    }
  }

  async update() {
    await this.create();
    let url = this.category + "/" + this.code;
    await this.nav(url);
    this.price = await this.getText(SEL_PRICE);
    this.desc = await this.getText(SEL_DESC);
    this.styles = await this.getStyles();
    await this.close();
  }

  print() {
    console.log(this);
  }

  watch = false;
}

export default Item;
