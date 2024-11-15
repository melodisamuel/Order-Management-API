const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');
const appError = require("../utils/appError");

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const newUser = await prisma.user.create({
    data: {
      name, 
      email,
      password, 
    },
  });

  // Generate a JWT token for the newly created user
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
    token, 
  });
});

exports.login = (req, res, next) => {
  const { email , password} = req.body;

  // Check if email and password exists 

  // Check if user exists and password is correct

  // check if ok, send token to client 
}
