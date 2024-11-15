const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserRepository {
  // Create user
  async createUser(data) {
    const { password, passwordConfirm, ...otherData } = data;

    if (password !== passwordConfirm) {
      throw new Error("Passwords do not match");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    return await prisma.user.create({
      data: {
        ...otherData,
        password: hashedPassword,
      },
    });
  }

  // Get user by ID
  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Update user password
  async updateUserPassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    return await prisma.user.update({
      where: { id },
      data: { password: hashedPassword, passwordChangedAt: new Date() },
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
        passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return resetToken;
  }

  // Check if password was changed after a certain timestamp
  async changedPasswordAfter(userId, JWTTimestamp) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordChangedAt: true },
    });

    if (!user || !user.passwordChangedAt) {
      return false;
    }

    const changedTimestamp = user.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }

  // Get all active users
  async getAllUsers() {
    return await prisma.user.findMany({
      where: {
        active: true,
      },
    });
  }
}

module.exports = new UserRepository();
