const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/users/userController");
const {
  products,
  singleProduct,
} = require("../controllers/products/productsController");
const {
  createShipping,
} = require("../controllers/shipping/shippingController");
const {
  addToCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  deleteUserCartItems,
  addOrUpdateCartItem,
} = require("../controllers/cart/cartController");

router.post("/user/register", register);
router.post("/user/login", login);
router.get("/products/all-products", products);
router.post("/products/singleProduct/:id", singleProduct);
router.post("/shipping/add-shippingInfo", createShipping);
router.post("/cart/add-to-cart", addToCart);
router.get("/cart/getCartByUserId/:userId", getCartByUserId);
router.put("/cart/updateCartProduct/:id", updateCartItem);
router.delete("/cart/deleteCartProduct/:id", deleteCartItem);
router.delete("/cart/deleteCartItemsByuserId/:userId", deleteUserCartItems);
router.put("/cart/addOrUpdateCartItem", addOrUpdateCartItem);

module.exports = router;
