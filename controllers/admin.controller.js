const Product = require("../models/product.model");
const Order = require("../models/order.model");
const { s3Client, bucketName } = require("../config/dev");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");
const crypto = require("crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("admin/products/all-products", { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res) {
  res.render("admin/products/new-product");
}

async function createNewProduct(req, res, next) {
  const file = req.file;
  const imageBuffer = await sharp(file.buffer).toBuffer(); // .resize({ height: 720, width: 1080, fit: "contain" })
  const imageName = crypto.randomBytes(32).toString("hex");

  //////////// upload image to S3
  const uploadParams = {
    Bucket: bucketName,
    Key: imageName,
    Body: imageBuffer,
    ContentType: file.mimetype,
  };
  await s3Client.send(new PutObjectCommand(uploadParams));

  const imageUrl = "".concat(
    "https://",
    bucketName,
    ".s3.amazonaws.com/",
    imageName
  );
  // save to database
  const product = new Product({
    ...req.body,
    image: imageName,
    imageUrl: imageUrl,
  });

  try {
    await product.save();
    // console.log(imageUrl);
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render("admin/products/update-product", { product: product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  });

  if (req.file) {
    const file = req.file;
    imageBuffer = await sharp(file.buffer).toBuffer(); // .resize({ height: 720, width: 1080, fit: "contain" })
    const imageName = crypto.randomBytes(32).toString("hex");

    //////////// upload image to S3
    const uploadParams = {
      Bucket: bucketName,
      Key: imageName,
      Body: imageBuffer,
      ContentType: file.mimetype,
    };
    await s3Client.send(new PutObjectCommand(uploadParams));

    const imageUrl = "".concat(
      "https://",
      bucketName,
      ".s3.amazonaws.com/",
      imageName
    );

    product.replaceImage(imageName, imageUrl);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function deleteProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error);
  }

  res.redirect("/admin/products");
}

//////////////////////////////// orders  ////////////////////////////////
async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render("admin/orders/admin-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: "Order updated", newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder,
};
