const express = require("express");

const { showOrders } = require("../../controllers/orderController");

const router = express.Router();

router.get("/orders", showOrders);

module.exports = router;
