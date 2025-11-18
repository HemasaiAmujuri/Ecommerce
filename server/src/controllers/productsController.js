const Products = require("../models/products/products");
const Cart = require("../models/cart/cart")

const products = async (req, res) => {
  try {
    const data = await Products.findAll();
    return res
      .status(200)
      .json({
        success: true,
        data: data,
        message: "Data Retrieved Successfully",
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { id, userId } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const product = await Products.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let quantity = 1;

    if (userId) {
      const cartItem = await Cart.findOne({
        where: { productId: id, userId },
      });
      if (cartItem) quantity = cartItem.quantity;
    }

    const productData = { ...product.dataValues, quantity: quantity || 1 };

    return res.status(200).json({
      success: true,
      data: productData,
      message: "Product retrieved successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
    });
  }
};

module.exports = {
  products,
  singleProduct,
};
