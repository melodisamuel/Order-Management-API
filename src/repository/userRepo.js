const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


class UserRepository {


  // Validate password
  async correctPassword(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
  
  

  // Check if email is already taken
  async checkEmailExists(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}

module.exports = new UserRepository();
