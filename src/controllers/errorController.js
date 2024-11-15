const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateFieldsErrDb = (err) => {
  // Check if errmsg property exists
  const valueMatch = err && err.message && err.message.match(/(["'])(\\?.)*?\1/);

  // Use the captured value or 'unknown' if errmsg is not available
  const duplicateValue = valueMatch ? valueMatch[0] : 'Already in use';

  console.log(duplicateValue);

  const message = `Field value: ${duplicateValue}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = err => {
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400);
}

const handleJwtError = () => new AppError('Invalid token. please login again!', 401)
const handleJWTExpiredError = () => new AppError('Your token has expired! Please login again.', 401)

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}

const sendErrProd = (err, res) => {
  // Trusted isOperational: Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: dont leak error details
  } else {
    // 1. Log error
    console.error("ERROR 💥", err);

    // 2. Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
  }
}




module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsErrDb(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDb(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();




    sendErrProd(error, res)
  }


};
