const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }

  req.user = user;
  next();
};

module.exports = protect;
