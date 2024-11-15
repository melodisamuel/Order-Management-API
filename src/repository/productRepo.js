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
}

module.exports = new ProductRepository();
