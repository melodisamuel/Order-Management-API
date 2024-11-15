const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ProductRepository {
  async createProduct(data) {
    return await prisma.product.create({ data });
  }

  async getAllProducts(filter, pagination) {
    return await prisma.product.findMany({
      where: filter,
      skip: pagination?.skip,
      take: pagination?.limit,
    });
  }

  async getProductById(id) {
    return await prisma.product.findUnique({ where: { id } });
  }

  async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id) {
    return await prisma.product.delete({ where: { id } });
  }

  /**
   * Update stock for a product.
   * @param {string} productId - The ID of the product.
   * @param {number} quantityChange - Positive to increase, negative to decrease.
   * @returns {Promise<Object>} - The updated product.
   */
  async updateStock(productId, quantityChange) {
    return await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantityChange, // Negative values will decrease stock.
        },
      },
    });
  }
}

module.exports = new ProductRepository();
