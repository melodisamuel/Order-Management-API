const AppError = require("../utils/appError");

const restrictTo = (...roles) => (req, res, next) => {
  
  if (!req.user || !req.user.role) {
    return next(new AppError("You are not authorized to perform this action", 403));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action", 403));
  }

  next();
};

module.exports = restrictTo;
