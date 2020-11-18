import Page from "./Page.js";

const {
  SUPREME_ALL,
  SEL_SHOP_CAT,
  SEL_SHOP_CATS,
  SEL_SOLD_OUT_TAG,
  SEL_SHOP_ITEMS
} = process.env;

class Store extends Page {
  constructor(categoriesObj) {
    super();
    this.categories = categoriesObj;
    this.supUrl = SUPREME_ALL;
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
        for (let i in this.categories) {
          await this.restockItems(i);
        }
      } else if (restockItems === 0) {
        for (let i in this.categories) {
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
  }

  // set navigation buttons for each category
  async setButtons() {
    // console.log("Setting category buttons...");
    const selector = SEL_SHOP_CATS;
    const texts = await this.getTexts(selector);
    const nodes = await this.getNodes(selector);
    await nodes.splice(0, 2);
    await texts.splice(0, 2);
    for (let i = 0; i < texts.length; i++) {
      // get rid of /sweaters
      let key = texts[i].replace(/\/\w*./, "");
      this.categories[key]["button"] = await nodes[i];
    }
    // console.log(await "Set category buttons.");
  }

  async getItemInfo() {
    console.log("getting item info...");
  }

  async refreshItems(category) {
    // get all the on-page item info of all items in a certain category
    // creates an array of item classes and stores them inside of the
    // this.categories[<category>].inventory property. if the item class
    // does not already exist, then make it. and each item class that gets made
    // will receive the following from this method:
    //                    name (string), category (string),
    //                    thumbnail (string,url), available (bool)
    // await this.categories[category].button.click();
    // await this.page.timeout(30);
    // console.log(await `Refreshed ${category}.`);
  }

  async restockItems(category) {
    // get all off-page item info of all items in a certain category
    // updates all of this.categories[<category>].inventory's array with
    // their respective "stock" properties,
    await this.refreshItems(category);
    // await this.categories[category].button.click();
    // await this.page.timeout(30);

    // let items = await this.getNodes(SEL_SHOP_ITEMS);

    // console.log(await `Restocked ${category}.`);
  }
  //
}

bench: {
}

export default Store;
