const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  status: {
    type: String,
    enum: ["pendiente", "en preparación", "enviada"],
    default: "pendiente",
  },
  createdAt: { type: Date, default: Date.now },
  address: String,
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
