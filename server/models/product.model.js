const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "El nombre del plato es obligatorio"],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      require: true,
    },
  },
  {
    timestamp: false,
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
