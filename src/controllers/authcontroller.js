const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const catchAsync = require("../middleware/catchAsync");
const jwt = require('jsonwebtoken');
const AppError = require("../utils/appError");
const bcrypt = require('bcryptjs');
const validator = require('validator'); 
const UserRepository = require("../repository/userRepo")

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  // Validate email format
  if (!validator.isEmail(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  // Check if password and passwordConfirm match
  // if (password !== passwordConfirm) {
  //   return next(new AppError('Passwords do not match.', 400));
  // }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user in the database
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generate JWT token
  const token = signToken( newUser.id)

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password} = req.body;

  // Check if email and password exists 
  if(!email || !password) {
    next(new AppError('Please provide email and password!', 400))
  }

  // Check if user exists and password is correct
  const user = await prisma.user.findUnique({
    where: { email },
  });


  if(!user || !await UserRepository.correctPassword(password, user.password)) {
    return next(new AppError('Incorrect email or password!', 401))
  }

  // check if ok, send token to client 
  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token
  }); 
})

// exports.protect = catchAsync(async (req, res, next) => {
//   let token;

//   // Get the token from the Authorization header (Bearer token)
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1]; // Bearer token
//   }

//   if (!token) {
//     return next(new AppError('You are not logged in! Please log in to get access.', 401));
//   }

//   // Verify the token and decode the payload
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   // Check if the user still exists in the database
//   const user = await prisma.user.findUnique({
//     where: { id: decoded.id },
//   });

//   if (!user) {
//     return next(new AppError('The user belonging to this token no longer exists.', 401));
//   }

//   // Attach user to the request object
//   req.user = user;

//   next();
// });

exports.getProfile = catchAsync(async (req, res, next) => {
  // The user information is now attached to req.user from the protect middleware
  const user = req.user;

  // Ensure user object is available
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  // Send back the user's profile details
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    }
  });
});

