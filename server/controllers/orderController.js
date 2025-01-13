const Order = require("../models/orders.model");

const showOrders = async (req, res) => {
  try {
    const order = await Order.find();

    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" + err });
  }
};

module.exports = { showOrders };
