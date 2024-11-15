const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../Controllers/authController')
const restrictTo = require("../middleware/roleMiddleware");
const protect = require("../middleware/protectMiddleware");



const router = express.Router();

router.post(
  '/',
  protect,
  restrictTo('Customer'),
  orderController.createOrder
);

router.get(
  '/',
  protect,
 restrictTo('Admin'),
 orderController.getOrders
);

router.get(
  '/:id',
  protect,
  orderController.getOrderById
);

router.put(
  '/:id/status',
  protect,
  restrictTo('Admin'),
  orderController.updateOrderStatus
);

module.exports = router;
