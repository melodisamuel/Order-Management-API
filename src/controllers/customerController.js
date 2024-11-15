const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/appError');
const CustomerRepository = require('../repository/cutomerRepo');
exports.createCustomer = catchAsync(async (req, res, next) => {
    console.log(req.body); 
  
    const { name, email, phone, address } = req.body;  
  
 
    if (!email) {
      return next(new AppError('Email is required', 400));
    }
  
    // Check if all required fields are present
    if (!name || !phone || !address) {  
      return next(new AppError('All fields (name, email, phone, address) are required', 400));
    }
  
    // Check if customer already exists by email
    const existingCustomer = await CustomerRepository.getCustomerByEmail(email);
    if (existingCustomer) {
      return next(new AppError('Customer with this email already exists', 400));
    }
  
    // Create the customer
    const customer = await CustomerRepository.createCustomer({
      name,
      email,
      phone,  
      address,
    });
  
    res.status(201).json({
      status: 'success',
      data: { customer },
    });
  });

// Get all customers
exports.getCustomers = catchAsync(async (req, res, next) => {
  const customers = await CustomerRepository.getAllCustomers();

  res.status(200).json({
    status: 'success',
    data: { customers },
  });
});

// Get customer by ID
exports.getCustomerById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const customer = await CustomerRepository.getCustomerById(id);
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { customer },
  });
});

// Update customer details
exports.updateCustomer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phoneNumber, address } = req.body;

  // Ensure the customer exists
  const customer = await CustomerRepository.getCustomerById(id);
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }

  // Update customer
  const updatedCustomer = await CustomerRepository.updateCustomer(id, {
    name,
    email,
    phoneNumber,
    address
  });

  res.status(200).json({
    status: 'success',
    data: { updatedCustomer },
  });
});

// Delete customer
exports.deleteCustomer = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Ensure the customer exists
  const customer = await CustomerRepository.getCustomerById(id);
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }

  // Delete customer
  await CustomerRepository.deleteCustomer(id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
