// Import required modules
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("xss-clean");
const hpp = require("hpp");

// Import Prisma client and error handling utilities
const { PrismaClient } = require("@prisma/client");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/errorController");

// Initialize Prisma client and express app
const prisma = new PrismaClient();
const app = express();

// Middleware setup
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body parser to read data from req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL injection and XSS
app.use(mongoSanitize());
app.use(hpp({ whitelist: ["model", "colorway", "size", "releaseYear", "price", "rating", "createdAt", "updatedAt"] }));

// Add request time to request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Import routers (similar to how you did with Mongoose)


// Define routes


// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
