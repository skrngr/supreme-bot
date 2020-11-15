const Supreme = require("./Supreme");

const { SEL_NAME, SEL_PRICE, SEL_DESC, SEL_STYLES } = process.env;

const Item = {
  load: async code => {
    await Supreme.nav("item", code);

    this.name = await Supreme.retrieve("item", SEL_NAME, "text");
    this.price = await Supreme.retrieve("item", SEL_PRICE, "text");
    this.desc = await Supreme.retrieve("item", SEL_DESC, "text");
    this.styles = await Supreme.getStyles();
  },

  print: _ => {
    let text = `
Name:   ${this.name}
Price:  ${this.price}
Desc:   ${this.desc}
Styles:`;

    this.styles.forEach(i => {
      text += `\n\t${i.name.trim()} has ${i.sizes.length} size(s) in stock`;
    });

    console.log(text);
  }
};

module.exports = Item;
