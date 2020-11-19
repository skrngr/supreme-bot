import puppeteer from "puppeteer";
import "./loadEnv.js";

import { Controller } from "./controllers/Supreme.js";

(async () => {
  await Controller.init();
})();
