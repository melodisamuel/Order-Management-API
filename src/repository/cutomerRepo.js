const prisma = require('../prismaClient'); // Prisma client instance

// Get all customers
exports.getAllCustomers = async (filter = {}) => {
  return await prisma.customer.findMany({
    where: filter,
  });
};

// Get a single customer by ID
exports.getCustomerById = async (id) => {
  return await prisma.customer.findUnique({
    where: { id },
  });
};

// Create a new customer
exports.createCustomer = async (data) => {
  return await prisma.customer.create({
    data,
  });
};

// Update customer details
exports.updateCustomer = async (id, data) => {
  return await prisma.customer.update({
    where: { id },
    data,
  });
};

// Delete a customer
exports.deleteCustomer = async (id) => {
  return await prisma.customer.delete({
    where: { id },
  });
};
