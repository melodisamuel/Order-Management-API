const AppError = require("../utils/appError");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require('../utils/catchAsync');

// Helper function to filter allowed fields for update
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// Update user (excluding password)
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates, please use /updateMyPassword.', 400));
  }

  // 2. Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3. Update user document
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: filteredBody,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Get a single user by ID
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Update user by ID
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: req.body,
  });

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Soft delete (deactivate) user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { active: false },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
