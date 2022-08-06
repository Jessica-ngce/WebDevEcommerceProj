const express = require("express");

const adminController = require("../controllers/admin.controller.js");

const imgaeUploadMiddleware = require("../middlewares/image-upload.js");

const router = express.Router();

router.get("/products", adminController.getProducts);

router.get("/products/new", adminController.getNewProduct);

// update product info
router.post(
  "/products/",
  imgaeUploadMiddleware,
  adminController.createNewProduct
);
router.get("/products/:id", adminController.getUpdateProduct);
router.post(
  "/products/:id",
  imgaeUploadMiddleware,
  adminController.updateProduct
);

// delete product
router.delete("/products/:id", adminController.deleteProduct);

// orders
router.get("/orders", adminController.getOrders);
router.patch("/orders/:id", adminController.updateOrder);

module.exports = router;
