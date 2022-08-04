const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");
const createSessionConfig = require("./config/session");

const db = require("./data/database");

let port = 3000;

// if deployed to heroku change listen PORT
if (process.env.PORT) {
  port = process.env.PORT;
}

const errorHandlerMiddleware = require("./middlewares/error-handler");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const cartUpdatePriceMiddleware = require("./middlewares/cart-updateprice.js");
const notFoundMiddleware = require("./middlewares/notfound");

const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/orders.routes");

const app = express();

// package ejs for rendering views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
// express for extracting data from request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const SessionConfig = createSessionConfig();

app.use(expressSession(SessionConfig));
app.use(csrf());

app.use(cartMiddleware);
app.use(cartUpdatePriceMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", protectRoutesMiddleware, orderRoutes); // add middleware to protect routes
app.use("/admin", protectRoutesMiddleware, adminRoutes); // in ejs files start with admin

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(port);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database");
    console.log(error);
  });
