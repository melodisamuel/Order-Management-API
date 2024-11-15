const catchAsync = require("../Middleware/catchAsync");
const AppError = require("../utils/appError");
const ProductRepository = require("../repository/productRepo");

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await ProductRepository.createProduct(req.body);
  res.status(201).json({
    status: "success",
    data: product,
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const { category, limit, page } = req.query;
  const filter = category ? { category } : {};
  const pagination = { skip: (page - 1) * limit || 0, limit: Number(limit) || 10 };

  const products = await ProductRepository.getAllProducts(filter, pagination);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: products,
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await ProductRepository.getProductById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await ProductRepository.updateProduct(req.params.id, req.body);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await ProductRepository.deleteProduct(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
