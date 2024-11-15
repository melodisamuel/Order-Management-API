const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');
const restrictTo = require("../middleware/roleMiddleware");


// Create a new customer
router.post('/',  CustomerController.createCustomer);

// Get all customers (Admin only)
router.get('/',  CustomerController.getCustomers);

// Get a single customer by ID
router.get('/:id',  CustomerController.getCustomerById);

// Update customer details
router.put('/:id',  CustomerController.updateCustomer);

// Delete customer
router.delete('/:id', restrictTo('Admin'),  CustomerController.deleteCustomer);

module.exports = router;
