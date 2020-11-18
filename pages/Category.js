class Category {
  constructor() {
    this.inventory = [];
  }

  async setButton(button) {
    this.button = await button;
  }
}

export default Category;
