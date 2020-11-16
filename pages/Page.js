// const Supreme = require("./Supreme");

const { VP_WIDTH, VP_HEIGHT } = process.env;

class Page {
  constructor() {}

  static async create(pge) {
    // constructor functions cannot be async so we
    // use a separate method to do asynchronous work;
    return new Page();
  }

  // static async createBrowserPage() {
  //   return await
  // }

  async setVP() {
    await this.page.setViewPort({
      width: parseInt(VP_WIDTH),
      height: parseInt(VP_HEIGHT)
    });
  }

  async nav(pageUrl) {
    await this.page.goto(this.supUrl + pageUrl);
  }

  async getText(selector) {
    return await this.page.$eval(selector, el => el.innerText);
  }

  async getNode(selector) {
    return await this.page.$(selector);
  }

  async getNodes(selector) {
    return await this.page.$$(selector);
  }
}

export default Page;
