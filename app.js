const puppeteer = require("puppeteer");

const url = "https://www.supremenewyork.com/shop/shirts/zkmt62fz1";

// function for formatting data
const print = (name, price, desc, styles) => {
  let text = `
    Name:   ${name}
    Price:  ${price}
    Desc:   ${desc}
    Styles:`;

  styles.forEach(i => {
    text += `\n\t    ${i.name.trim()} has ${i.sizes.length} size(s) in stock`;
  });

  console.log(text);
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // "networkidle2" option tells browser that the navigation is not
  // finished until there are 2 or less network connections for at
  // least half of a second
  await page.goto(url, { waitUntil: "networkidle2" });

  // the #details element holds all the product information in child
  // elements so we wait for it to load, just to be safe
  await page.waitForSelector("#details");

  // defining getSizes() function in browser context for later use.
  // does exactly what it says: gets the sizes for the current
  // selected item
  await page.evaluate(() => {
    window.getSizes = () => {
      const sizes = [];
      const options = document.querySelectorAll("#s>option");
      for (let i = 0; i < options.length; i++) {
        sizes.push(options[i].innerText);
      }
      return sizes;
    };
  });

  // get item name
  const name = await page.$eval("h2[class='protect']", el => el.innerText);
  // get item price
  const price = await page.$eval(
    "span[data-currency='USD']",
    el => el.innerText
  );
  // get item description
  const desc = await page.$eval("#details>p:nth-child(3)", el => {
    return el.innerText;
  });
  // get all buttons for selecting the different item colors later
  // via the .click() method. also use these button elements to grab
  // the names of the styles ("i.e. ")
  const styleButtons = await page.$$("#details>ul>li>button:first-child");

  // loop through styleButtons & push an object containing a name and
  // an array of sizes for each style to the styles array
  const styles = [];
  for (let i in styleButtons) {
    let btn = styleButtons[i];
    await btn.click();
    await page.waitForTimeout(200);
    styles.push(
      await page.evaluate(btn => {
        return {
          name: btn.getAttribute("data-style-name"),
          sizes: [...getSizes()]
        };
      }, btn)
    );
  }

  // print out scraped info
  print(name, price, desc, styles);

  await browser.close();
})();
