const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserRepository {
  // Create user
  async createUser(data) {
    const { password, ...otherData } = data;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    return await prisma.user.create({
      data: {
        ...otherData,
        password: hashedPassword,
      },
    });
  }

  // Validate password
  async correctPassword(candidatePassword, userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) throw new Error("User not found");

    return await bcrypt.compare(candidatePassword, user.password);
  }

  // Generate password reset token
  async generatePasswordResetToken(userId) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: hashedResetToken,
        passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      },
    });

    return resetToken;
  }

  // Get all active users
  async getAllUsers() {
    return await prisma.user.findMany({
      where: {
        active: true,
      },
    });
  }

  // Update user role
  async updateUserRole(userId, role) {
    return await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  // Deactivate a user
  async deactivateUser(userId) {
    return await prisma.user.update({
      where: { id: userId },
      data: { active: false },
    });
  }
}

module.exports = new UserRepository();
