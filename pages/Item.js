// const Supreme = require("./Supreme");
import Page from "./Page.js";
import Prompt from "../command/Prompt.js";

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
  constructor() {
    // super(page);
    super();
    this.supUrl = SUPREME_SHOP;
  }

  async getStyles() {
    let styleButtons = await this.page.$$(SEL_STYLES);

    let styles = [];
    let promises = [];

    return new Promise(async (res, rej) => {
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
          }, await btn);

          style.sizes = [...sizes];
          styles.push(style);
        }
      }
      res(await styles);
    });
  }

  async update() {
    let tries = 0;
    Prompt.write(`Updating ${this.name}...`);
    await this.create();
    let url = this.category + "/" + this.code;

    async function getInfo() {
      this.styles = await this.getStyles();
      this.desc = await this.getText(SEL_DESC);
      this.price = await this.getText(SEL_PRICE);
      await this.close();
    }

    let func = getInfo.bind(this);

    return await this.promiseToLoad(this.code, 3, 60000).then(async res => {
      await func();
    });

    // let promiseToUpdate = newPromise(async (rfunction()eject) => {
    //   async function keepTrying() {
    //
    //   }
    //   refreshes <= 5
    //     ? await this.nav(url).then(refreshes++)
    //     : reject("Timedout 5 times");
    // });
  }

  print() {
    console.log(this);
  }

  watch = false;
}

export default Item;
