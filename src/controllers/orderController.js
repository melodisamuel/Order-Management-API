const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/appError');
const OrderRepository = require('../repository/orderRepository');
const ProductRepository = require('../repository/productRepo'); // For stock validation

exports.createOrder = catchAsync(async (req, res, next) => {
  const { items } = req.body;

  // Ensure products exist and validate stock
  for (const item of items) {
    const product = await ProductRepository.getProductById(item.productId);
    if (!product) {
      return next(new AppError(`Product with ID ${item.productId} not found`, 404));
    }
    if (product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for product ${product.name}`, 400));
    }
  }

  // Deduct stock
  for (const item of items) {
    await ProductRepository.updateStock(item.productId, -item.quantity);
  }

  // Create the order
  const order = await OrderRepository.createOrder({
    customerId: req.user.id,
    items,
  });

  res.status(201).json({
    status: 'success',
    data: { order },
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const filter = req.user.role === 'Admin' ? {} : { customerId: req.user.id };
  const orders = await OrderRepository.getAllOrders(filter);

  res.status(200).json({
    status: 'success',
    data: { orders },
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await OrderRepository.getOrderById(id);

  if (!order || (req.user.role !== 'Admin' && order.customerId !== req.user.id)) {
    return next(new AppError('Order not found or access denied', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return next(new AppError('Access denied', 403));
  }

  const { id } = req.params;
  const { status } = req.body;

  const order = await OrderRepository.updateOrderStatus(id, status);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});
