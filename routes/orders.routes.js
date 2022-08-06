const express = require("express");

const ordersController = require("../controllers/orders.controller");

const router = express.Router();

router.post("/", ordersController.newOrder); // /orders regiestered in app.js

router.get("/", ordersController.getOrders);

router.get("/success", ordersController.orderSuccess);

router.get("/failure", ordersController.orderFailure);

module.exports = router;
