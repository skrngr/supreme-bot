const readline = require("readline");

const Item = require("./Item");

const Parse = require("./utils/Parse");

const Command = {
  query: {
    options: {
      code: {
        desc: "Query by code",
        run: vals => {
          console.log(
            `You ran 'query' with the 'code' options with a value of ${vals} :)`
          );
        }
      }
    },
    desc: "Query by",
    run: async function(opt, vals) {
      console.log("You ran 'query' with no options :)");
    }
  },
  item: {}
};

const Prompt = {
  start: async function() {
    // give Prompt an input stream
    this.read = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "[s-b@v0.1.0] : "
    });
    // set function to be called on "line" event (i.e. on enter)
    this.read.on("line", async d => {
      let { cmd, opt, vals } = Parse.cmd(d);
      console.log(vals);
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

module.exports = Prompt;
