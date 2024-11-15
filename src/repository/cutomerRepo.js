const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CustomerRepository {
  // Create a new customer
  async createCustomer(data) {
    return await prisma.customer.create({ data });
  }

  // Get all customers with filter and pagination
  async getAllCustomers(filter = {}, pagination) {
    return await prisma.customer.findMany({
      where: filter,
      skip: pagination?.skip,
      take: pagination?.limit,
    });
  }

  // Get a customer by ID
  async getCustomerById(id) {
    return await prisma.customer.findUnique({ where: { id } });
  }

  // Get a customer by email
  async getCustomerByEmail(email) {
    return await prisma.customer.findUnique({ where: { email } });
  }

  // Update customer details
  async updateCustomer(id, data) {
    return await prisma.customer.update({
      where: { id },
      data,
    });
  }

  // Delete a customer by ID
  async deleteCustomer(id) {
    return await prisma.customer.delete({ where: { id } });
  }
}

// Export a single instance of the repository
module.exports = new CustomerRepository();
