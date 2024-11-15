const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderRepository {
  // Create a new order
  async createOrder(data) {
    return await prisma.order.create({
      data: {
        customerId: data.customerId,
        status: data.status || 'Pending',
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          })),
        },
      },
      include: { items: true },
    });
  }

  // Get all orders (Admin only)
  async getAllOrders(filter = {}) {
    return await prisma.order.findMany({
      where: filter,
      include: { customer: true, items: { include: { product: true } } },
    });
  }

  // Get a specific order
  async getOrderById(id) {
    return await prisma.order.findUnique({
      where: { id },
      include: { customer: true, items: { include: { product: true } } },
    });
  }

  // Update order status
  async updateOrderStatus(id, status) {
    return await prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}

module.exports = new OrderRepository();
