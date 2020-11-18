// const Supreme = require("./Supreme");

const { VP_WIDTH, VP_HEIGHT } = process.env;

class Page {
  constructor() {}

  async create(page) {
    this.page = await page;
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
    await this.page.goto(this.supUrl + pageUrl, { waitUntil: "networkidle2" });
  }

  async getText(selector) {
    return await this.page.$eval(selector, el => el.innerText);
  }

  async getTexts(selector) {
    // console.log(selector);
    return await this.page.$$eval(selector, el => {
      let texts = [];
      el.forEach(node => {
        return texts.push(node.innerText);
      });
      return texts;
    });
  }

  async getNode(selector) {
    return await this.page.$(selector);
  }

  async getNodes(selector) {
    return await this.page.$$(selector);
  }

  async timeout(time) {
    await this.page.waitForTimeout(time);
  }
}

export default Page;
