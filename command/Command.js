import { Controller } from "../controllers/Supreme.js";

const Command = {
  // query command
  query: {
    options: {
      code: {
        desc: "Query by code",
        run: vals => {
          Controller.query();
        }
      }
    },
    desc: "Query by",
    run: async function(opt, vals) {
      console.log("You ran 'query' with no options :) *launch wizard*");
    }
  },

  // watch command
  watch: {
    options: {
      list: {
        desc: "List current watched items",
        run: vals => {
          Controller.watch.list();
        }
      }
    },
    desc: "Select item to watch",
    run: async function(opt, vals) {
      Controller.watch.add();
    }
  },
  // cart command
  cart: {
    options: {
      list: {
        desc: "",
        run: () => console.log("'cart list' command coming soon!")
      },
      add: {
        desc: "",
        run: () => console.log("'cart add <item>' command coming soon!")
      },
      remove: {
        desc: "",
        run: () => console.log("'cart remove <item>' command coming soon!")
      }
    },
    desc: "",
    run: () => {
      console.log("'cart' command coming soon!");
    }
  }
};

export default Command;
// module.exports = Supreme;
