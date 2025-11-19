const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/userController");
const {
  products,
  singleProduct,
} = require("../controllers/productsController");
const {
  cartProducts,
  addToCart,
  updateCartItem,
  deleteCartItem,
  deleteCartItemsByuserId,
  addOrUpdateCartItem,
} = require("../controllers/cartController");
const { addShippingInfo } = require("../controllers/shippingController");

router.post("/user/register", register);
router.post("/user/login", login);
router.get("/products/all-products", products);
router.get("/products/singleProduct/:id", singleProduct);
router.get("/cart/getCartByUserId/:userId", cartProducts);
router.post("/cart/add-to-cart", addToCart);
router.put("/cart/updateCartProduct/:id", updateCartItem);
router.delete("/cart/deleteCartProduct/:id", deleteCartItem);
router.delete("/cart/deleteCartItemsByuserId/:userId", deleteCartItemsByuserId);
router.put("/cart/addOrUpdateCartItem", addOrUpdateCartItem);
router.post("/shipping/add-shippingInfo", addShippingInfo);


module.exports = router;