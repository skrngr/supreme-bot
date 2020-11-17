import { Controller } from "../controllers/Supreme.js";

const Command = {
  // query command
  query: {
    options: {
      code: {
        desc: "Query by code",
        run: value => {
          Controller.query.code(value);
        }
      }
    },
    desc: "Query by",
    run: async function(opt, value) {
      Controller.query.type();
    }
  },

  // watch command
  watch: {
    options: {
      list: {
        desc: "List current watched items",
        run: value => {
          Controller.watch.list();
        }
      }
    },
    desc: "Select item to watch",
    run: async function(opt, vals) {
      await Controller.watch.add();
    }
  },
  // cart command
  cart: {
    options: {
      list: {
        desc: "",
        run: () => Controller.cart.list()
      },
      add: {
        desc: "",
        run: () => Controller.cart.add()
      },
      remove: {
        desc: "",
        run: () => Controller.cart.remove()
      }
    },
    desc: "",
    run: () => Controller.cart.list()
  }
};

export default Command;
// module.exports = Supreme;
