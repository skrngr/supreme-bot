import Page from "./Page.js";
import Item from "./Item.js";
import Prompt from "../command/Prompt.js";
import { Context, Controller } from "../controllers/Supreme.js";

const {
  SUPREME_ALL,
  SEL_SHOP_CAT,
  SEL_SHOP_CATS,
  SEL_SOLD_OUT_TAG,
  SEL_SHOP_ITEMS,
  SEL_SHOP_LINKS,
  SEL_SHOP_STYLES,
  SUPREME
} = process.env;

class Store extends Page {
  constructor() {
    super();
    this.supUrl = SUPREME;
    this.inventory = [];
  }

  async load(category, restockItems) {
    // navigate to SUREME_ALL

    this.name = "Supreme Startup";
    this.supUrl = SUPREME_ALL;

    if (this.page._frameManager._mainFrame._url === "about:blank") {
      console.log(`Loading store page...`);
    } else {
      console.log("Refreshing store page...");
    }

    await this.promiseToLoad(this.supUrl, 10, 60000);
    try {
      await this.setButtons();

      // console.log(await this.categories);
      let links = await this.getHrefs(SEL_SHOP_CATS);
      await links.splice(0, 2);

      let promises = [];
      for (let i = 0; i < links.length; i++) {
        promises.push(
          new Promise(async (resolve, reject) => {
            let shop = await new Store();
            let key = Array.from(links[i].split("/"))
              .slice(3)
              .join("");
            shop.name = key;
            await shop.create(1, 1);
            await shop.promiseToLoad(links[i], 3, 120000);
            await shop.setButtons();

            resolve(
              await shop
                .restockItems(false, key === "tops_sweaters" ? "tops" : key)
                .then(async () => {
                  console.log("restocked");
                  await shop.close();
                })
            );
          })
        );
      }

      return await Promise.all(promises)
        .then(() => {
          Prompt.write(`${this.inventory.length} Supreme items scraped!`);
        })
        .catch(e => Prompt.write(`ERROR INITIALIZING INVENTORY: \n\t\t${e}`));
    } catch (e) {
      Prompt.write(`FAILURE LOADING INITIAL SHOP PAGE:\n\t\t${e}`);
      return e;
    }

    // await this.page.goto(this.supUrl, { waitUntil: "networkidle2" });
    // await console.log(`Store page loaded at: ${this.supUrl}`);
    // console.log(await this.page);
  }

  // set navigation buttons for each category
  async setButtons() {
    // console.log("Setting category buttons...");
    const selector = SEL_SHOP_CATS;
    const texts = await this.getTexts(selector);
    const nodes = await this.getNodes(selector);
    const hrefs = await this.getHrefs(selector);
    await nodes.splice(0, 2);
    await texts.splice(0, 2);
    let btns = {};
    for (let i = 0; i < texts.length; i++) {
      // get rid of /sweaters
      let key = texts[i].replace(/\/\w*./, "");
      btns[key] = { href: hrefs[i], node: await nodes[i] };
    }
    this.buttons = await btns;
  }

  async refreshItems(click, category) {
    await Prompt.write(`Refreshing all ${category}...`);
    if (click) {
      await this.buttons[category].node.click();
      await this.timeout(2000);
    }

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
          if (Context.store.inventory[indexOfItem][key] !== item[key]) {
            Context.store.inventory[indexOfItem][key] = item[key];
          }
        }
      } else if (indexOfItem === -1) {
        Context.store.inventory.push(items[i]);
      }
    }
  }

  async restockItems(click, category) {
    await this.refreshItems(click, category);
    await Prompt.write(`Restocking all ${category}...`);
    let promises = [];
    let toBeUpdated = [];
    if (category !== "skate") {
      for (let i = 0; i < (await Context.store.inventory.length); i++) {
        if ((await Context.store.inventory[i].type) === category) {
          // if any styles are available, update the item
          for (let j of await Context.store.inventory[i].styles) {
            if (await j.available) {
              // promises.push(
              //   new Promise((resolve, reject) =>
              //     resolve(Context.store.inventory[i].update())
              //     // console.log("promise made")
              //   )
              // );
              toBeUpdated.push(i);
              break;
            }
          }
        }
      }
      for (let i = 0; i < toBeUpdated.length; i += 5) {
        let current = toBeUpdated.slice(i, i + 5);
        for (let j = 0; j < 5; j++) {
          promises.push(
            new Promise((resolve, reject) => {
              resolve(Context.store.inventory[toBeUpdated[i]].update());
            })
          );
          await Promise.all([promises]);
          promises = await [];
        }
        // await Promise.all(promises).catch(e => "error at restock");
      }
    }
  }
}

export default Store;
