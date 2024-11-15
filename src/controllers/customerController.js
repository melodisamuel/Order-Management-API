const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/appError');
const CustomerRepository = require('../repository/customerRepository');

// Create a new customer
exports.createCustomer = catchAsync(async (req, res, next) => {
  const { name, email, phoneNumber } = req.body;

  // Check if customer already exists by email (or other unique identifiers)
  const existingCustomer = await CustomerRepository.getCustomerByEmail(email);
  if (existingCustomer) {
    return next(new AppError('Customer with this email already exists', 400));
  }

  // Create the customer
  const customer = await CustomerRepository.createCustomer({
    name,
    email,
    phoneNumber,
  });

  res.status(201).json({
    status: 'success',
    data: { customer },
  });
});

// Get all customers
exports.getCustomers = catchAsync(async (req, res, next) => {
  const filter = req.user.role === 'Admin' ? {} : { id: req.user.id };
  const customers = await CustomerRepository.getAllCustomers(filter);

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
  const { name, email, phoneNumber } = req.body;

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
