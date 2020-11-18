import Page from "./Page.js";
import Item from "./Item.js";
import Prompt from "../command/Prompt.js";

const {
  SUPREME_ALL,
  SEL_SHOP_CAT,
  SEL_SHOP_CATS,
  SEL_SOLD_OUT_TAG,
  SEL_SHOP_ITEMS,
  SEL_SHOP_LINKS,
  SEL_SHOP_STYLES
} = process.env;

class Store extends Page {
  constructor() {
    super();
    this.supUrl = SUPREME_ALL;
    this.inventory = [];
  }

  async load(category, restockItems) {
    // navigate to SUREME_ALL

    if (this.page._frameManager._mainFrame._url === "about:blank") {
      console.log(`Loading store page...`);
    } else {
      console.log("Refreshing store page...");
    }

    await this.page.goto(this.supUrl, { waitUntil: "networkidle2" });
    await console.log(`Store page loaded at: ${this.supUrl}`);
    // console.log(await this.page);

    await this.setButtons();

    // console.log(await this.categories);

    if (category === "all") {
      if (restockItems === 1) {
        for (let i in this.buttons) {
          await this.restockItems(i);
        }
      } else if (restockItems === 0) {
        for (let i in this.buttons) {
          await this.refreshItems(i);
        }
      }
    } else if (category !== "all") {
      if (restockItems === 1) {
        await this.restockItems(category);
      } else if (restockItems === 0) {
        await this.refreshItems(category);
      }
    }

    await Prompt.write(`${this.inventory.length} items scraped!`);

    // await console.log(await this.inventory);
    //
    // await this.refreshItems("hats");
  }

  // set navigation buttons for each category
  async setButtons() {
    // console.log("Setting category buttons...");
    const selector = SEL_SHOP_CATS;
    const texts = await this.getTexts(selector);
    const nodes = await this.getNodes(selector);
    await nodes.splice(0, 2);
    await texts.splice(0, 2);
    let btns = {};
    for (let i = 0; i < texts.length; i++) {
      // get rid of /sweaters
      let key = texts[i].replace(/\/\w*./, "");
      btns[key] = await nodes[i];
    }
    // console.log(await "Set category buttons.");
    this.buttons = await btns;
  }

  async refreshItems(category) {
    Prompt.write(`Refreshing all ${category}...`);
    await this.buttons[category].click();
    await this.timeout(2000);
    await this.page.waitForSelector("#container");
    await this.setButtons();

    let nodes = await this.getNodes(SEL_SHOP_LINKS);
    let names = await this.getTexts(SEL_SHOP_ITEMS);
    let styles = await this.getTexts(SEL_SHOP_STYLES);

    let links = await this.getHrefs(SEL_SHOP_LINKS);

    let itemAvail = [];
    let itemCodes = [];
    let itemTypes = [];
    let styleCodes = [];

    // check if flagged for "sold out" or not
    for (let i = 0; i < nodes.length; i++) {
      itemAvail.push(
        await this.page.evaluate(node => {
          return node.childNodes.length === 1;
        }, nodes[i])
      );
    }

    links.forEach(l => {
      let arr = l.split("/").slice(2);
      itemTypes.push(arr[0]);
      itemCodes.push(arr[1]);
      styleCodes.push(arr[2]);
    });

    let items = [];

    let currentItem;
    for (let i = 0; i < names.length; i++) {
      if (items.findIndex(obj => obj.name === names[i]) === -1) {
        let item = new Item();
        item.name = names[i].trim().replace(/\n/i, " ");
        item.code = itemCodes[i];
        item.type = itemTypes[i];
        item.styles = [];
        items.push(item);
        currentItem = items.length - 1;
      }
      items[currentItem].styles.push({
        name: styles[i],
        code: styleCodes[i],
        available: itemAvail[i]
      });
    }

    for (let i = 0; i < items.length; i++) {
      let code;
      if (items[i].hasOwnProperty(code)) {
        code = items[i].code;
      } else {
        code = false;
      }
      let indexOfItem = this.inventory.findIndex(i => i.code === code);
      if (indexOfItem !== -1) {
        for (let key in item) {
          if (this.inventory[indexOfItem][key] !== item[key]) {
            this.inventory[indexOfItem][key] = item[key];
          }
        }
      } else if (indexOfItem === -1) {
        this.inventory.push(items[i]);
      }
    }
  }

  async restockItems(category) {
    await this.refreshItems(category);
    Prompt.write(`Restocking all ${category}...`);
    if (category !== "skate") {
      for (let i = 0; i < (await this.inventory.length); i++) {
        if (this.inventory[i].type === category) {
          // if any styles are available, update the item
          for (let j of this.inventory[i].styles) {
            if (j.available) {
              await this.inventory[i].update();
              break;
            }
          }
        }
      }
    }
  }
}

export default Store;
