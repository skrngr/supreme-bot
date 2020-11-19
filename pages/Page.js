import { Controller } from "../controllers/Supreme.js";
import Prompt from "../command/Prompt.js";

const { VP_WIDTH, VP_HEIGHT } = process.env;

class Page {
  constructor() {}

  async create(blockImages, blockCss) {
    this.page = await Controller.newPage();

    blockImages = 1;
    blockCss = 0;

    if (blockImages || blockCss) {
      await this.page.setRequestInterception(true);
    }
    if (blockCss && blockImages) {
      this.page.on("request", req => {
        if (
          req.resourceType() === "stylesheet" ||
          req.resourceType() === "font" ||
          req.resourceType() === "image"
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });
    } else if (blockCss) {
      this.page.on("request", req => {
        if (
          req.resourceType() === "stylesheet" ||
          req.resourceType() === "font"
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });
    } else if (blockImages) {
      this.page.on("request", req => {
        if (req.resourceType() === "image") {
          req.abort();
        } else req.continue();
      });
    }
  }

  async promiseToLoad(suffix, tries, timeout) {
    let promise;
    let i = 0;
    let name = this.name;
    if (i <= tries) {
      i++;
      let promise = await await this.page
        .goto(this.supUrl === suffix ? suffix : this.supUrl + suffix, {
          waitUntil: "networkidle2",
          timeout: timeout
        })
        .then(
          async res => {
            await Prompt.write(`Loaded ${name} page...`);
            i = 0;
            return res;
          },
          async rej => {
            console.log(
              `Failed to load ${name} page, timed out. But I'm retrying...`
            );
            return await promiseToUpdate();
          }
        );
    } else {
      promise = new Promise((res, rej) =>
        reject(
          `FAILED TO LOAD ${this.name.toUppercase()} PAGE, EXCEED TIMEOUT LIMIT OF ${timeout}`
        )
      );
    }

    return promise;
  }

  async close() {
    await this.page.close();
  }

  // tbh idk if this does anything useful
  async removeTransition() {
    await this.page.evaluate(() => {
      let nodes = document.querySelectorAll("*");
      for (let i of nodes) {
        i.style.transition = "none";
        i.style.opacity = "1";
      }
    });
  }

  async setVP() {
    await this.page.setViewPort({
      width: parseInt(VP_WIDTH),
      height: parseInt(VP_HEIGHT)
    });
  }

  async nav(pageUrl) {
    return await this.page.goto(this.supUrl + pageUrl, {
      waitUntil: "networkidle2"
    });
  }

  async getText(selector) {
    return await this.page.$eval(selector, el => el.innerText);
  }

  async getTexts(selector) {
    return await this.page.$$eval(selector, el => {
      let texts = [];
      el.forEach(node => {
        return texts.push(node.innerText);
      });
      return texts;
    });
  }

  async getHrefs(selector) {
    return await this.page.$$eval(selector, el => {
      let attr = [];
      el.forEach(node => {
        return attr.push(node.getAttribute("href"));
      });
      return attr;
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
