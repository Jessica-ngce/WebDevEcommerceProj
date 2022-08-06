const Product = require("../models/product.model");

function getCart(req, res) {
  res.render("customer/cart/cart");
}

async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    next(error);
    return;
  }
  //   update session after cart
  const cart = res.locals.cart;

  cart.addItem(product);
  req.session.cart = cart;

  res.status(201).json({
    message: "Cart Updated",
    newTotalItems: cart.totalQuantity,
  });
}

function updateCartItem(req, res) {
  // get cart from res!! not req
  const cart = res.locals.cart;
  const updatedItemData = cart.updateItem(
    req.body.productId,
    +req.body.quantity
  );

  req.session.cart = cart;

  res.json({
    message: "Item Updated!",
    updatedCart: {
      newtotalQuantity: cart.totalQuantity,
      newtotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
};
