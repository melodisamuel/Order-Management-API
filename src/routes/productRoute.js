const express = require("express");
const productController = require("../controllers/productController");
const protect = require("../middleware/protectMiddleware");
const restrictTo = require("../middleware/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, productController.createProduct)
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(productController.getProductById)
  .put(protect,  productController.updateProduct)
  .delete(protect, productController.deleteProduct);

module.exports = router;
