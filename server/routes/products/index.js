const express = require("express");
const {
  createProduct,
  getProducts,
} = require("../../controllers/productController");

const router = express.Router();

router.post("/product", createProduct);
router.get("/product", getProducts);

module.exports = router;
