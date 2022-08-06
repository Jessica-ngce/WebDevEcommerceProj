async function updateCartPrices(req, res, next) {
  const cart = res.locals.cart;
  try {
    await cart.updatePrices();
  } catch (error) {
    return next(error);
  }
  next();
}

module.exports = updateCartPrices;
