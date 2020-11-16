import { Controller } from "../controllers/Supreme.js";

const Command = {
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
      console.log("You ran 'query' with no options :)");
    }
  },

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
  }
};

export default Command;
// module.exports = Supreme;
