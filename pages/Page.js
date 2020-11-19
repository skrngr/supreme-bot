import { Controller } from "../controllers/Supreme.js";
import Prompt from "../command/Prompt.js";

const { VP_WIDTH, VP_HEIGHT } = process.env;

class Page {
  constructor() {}

  async create(blockImages, blockCss) {
    blockImages = true;
    blockCss = false;
    this.page = await Controller.newPage();

    if (blockImages || blockCss) {
      await this.page.setRequestInterception(true);
    }
    // if (blockCss && blockImages) {
    // this.page.on("request", async req => {
    //   if (
    //     req.resourceType() == "stylesheet" ||
    //     req.resourceType() == "font" ||
    //     req.resourceType() == "image"
    //   ) {
    //     await req.abort();
    //   } else {
    //     await req.continue();
    //   }
    // });
    // } else if (blockCss) {
    //   this.page.on("request", async req => {
    //     if (
    //       req.resourceType() === "stylesheet" ||
    //       req.resourceType() === "font"
    //     ) {
    //       await req.abort();
    //     } else {
    //       await req.continue();
    //     }
    //   });
    // } else if (blockImages) {
    //   this.page.on("request", req => {
    //     if (req.resourceType() === "image") {
    //       req.abort();
    //     } else {
    //       req.continue();
    //     }
    //   });
    // }
  }

  tries = 0;

  async promiseToLoad(suffix, tries, timeout) {
    function resetTries(x) {
      this.tries = x;
    }

    let updateTries = resetTries.bind(this);

    let promise;

    let name = this.name;

    if (this.tries <= tries) {
      let promise = await this.page
        .goto(this.supUrl === suffix ? suffix : this.supUrl + suffix, {
          waitUntil: "networkidle2",
          timeout: timeout
        })
        .then(
          async res => {
            await Prompt.write(`Loaded ${name} page...`);
            updateTries(0);
            return res;
          },
          async rej => {
            console.log(
              `Failed to load ${name} page, timed out. But I'm retrying...`
            );
            updateTries(this.tries + 1);
            await this.promiseToLoad();
            return rej;
          }
        );
    } else {
      promise = new Promise((res, rej) =>
        rej(
          `FAILED TO LOAD ${this.name.toUpperCase()} PAGE, EXCEED TIMEOUT LIMIT OF ${tries}`
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
