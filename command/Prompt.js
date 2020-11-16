import readline from "readline";

import Parse from "../utils/Parse.js";
import Command from "./Command.js"; // console.log(Command);
import { Controller } from "../controllers/Supreme.js";

const Prompt = {
  start: async function() {
    await Controller.init();
    // give Prompt an input stream
    this.read = await readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "[s-b@v0.1.0] : "
    });
    // set function to be called on "line" event (i.e. on enter)
    this.read.on("line", async d => {
      let { cmd, opt, vals } = Parse.cmd(d);
      // console.log(vals);
      // pause input stream
      this.read.pause();
      // check for command
      if (Command.hasOwnProperty(cmd)) {
        if (Command[cmd].options.hasOwnProperty(opt)) {
          await Command[cmd].options[opt].run(vals);
        } else {
          await Command[cmd].run();
        }
      } else {
        Prompt.write("No command found!");
      }
      // resume input stream and prompt
      this.read.resume();
      await this.read.prompt();
    });

    this.read.prompt();
  },

  write: text => {
    console.log(text);
  }
};

export default Prompt;
