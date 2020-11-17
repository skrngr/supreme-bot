import Page from "./Page.js";

const { SUPREME_ALL } = process.env;

class Shop extends Page {
  constructor() {
    super();

    this.supUrl = SUPREME_ALL;
  }

  async load() {}

  bench: {};
}

export default Shop;
