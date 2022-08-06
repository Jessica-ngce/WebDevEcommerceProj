const Order = require("../models/order.model");
const User = require("../models/user.model");
const stripe = require("stripe")(
  "sk_test_51LPeFWDJS1hIdT9QUKmzFpak0NbsaVFBFayAnrm4gMiPRe84oGWLVpXKdD8BXXQGiRwuec3OSYs5RZSewk5RAVvx00aYP93Eeh"
);

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", { orders: orders });
  } catch (error) {
    return next(error);
  }
}

async function newOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDoc;
  try {
    userDoc = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDoc);

  try {
    await order.save();
  } catch (error) {
    return;
  }

  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cart.items.map(function (item) {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price.toFixed(2) * 100,
        },
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url);
}

function orderSuccess(req, res) {
  res.render("customer/orders/success");
}

function orderFailure(req, res) {
  res.render("customer/orders/failure");
}

module.exports = {
  newOrder: newOrder,
  getOrders: getOrders,
  orderSuccess: orderSuccess,
  orderFailure: orderFailure,
};
