const puppeteer = require("puppeteer");

const url = "https://www.supremenewyork.com/shop/shirts/zkmt62fz1";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // "networkidle2" option tells browser that the navigation is not finished until there are 2 or less network connections for at least half of a second
  await page.goto(url, { waitUntil: "networkidle2" });

  // runs as if it was coming from the browser console
  const item = await page.evaluate(() => {
    // retrieve name
    const name = document.querySelector("h2[class='protect']").innerText;

    // retrieve description
    const desc = document.querySelector("#details>p:nth-child(3)").innerText;

    // retrieve different styles (array of colors)
    const styles = [];
    document
      .querySelectorAll("#details>ul>li>button:first-child")
      .forEach(el => {
        styles.push({ name: el.getAttribute("data-style-name") });
      });

    // return everything into item object

    return {
      name,
      desc,
      styles
    };
  });

  console.log(item.styles);

  await browser.close();
})();
