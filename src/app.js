// Import required modules
const path = require("path");
const express = require("express");
const morgan = require("morgan");

// Import Prisma client and error handling utilities
const { PrismaClient } = require("@prisma/client");
const AppError = require("./utils/appError");
const globalErrorHandler = require("../src/controllers/errorController");
const authRoute = require("../src/routes/authRoute");
const productRoute = require("../src/routes/productRoute");

// Initialize Prisma client and express app
const prisma = new PrismaClient();
const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser to read data from req.body
app.use(express.json({ limit: "10kb" }));

// Add request time to request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);

  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
