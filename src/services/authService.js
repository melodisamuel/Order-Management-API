const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AuthService {
  async addUser(requestBody) {
    const { email, password, firstName, lastName } = requestBody;

    // Insert to DB
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
      },
    });

    return newUser;
  }
}

module.exports = new AuthService();
