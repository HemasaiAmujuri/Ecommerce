const fs = require("fs");
const path = require("path");

const cartDataFile = path.join(__dirname, "../../data/cart.json");

const loadCart = () => {
  if (!fs.existsSync(cartDataFile)) return [];
  const content = fs.readFileSync(cartDataFile, "utf8").trim();
  if (!content) return [];
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("Error parsing cart.json:", err.message);
    return [];
  }
};

const saveCart = (data) => {
  fs.writeFileSync(cartDataFile, JSON.stringify(data, null, 2), "utf8");
};


const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required",
      });
    }

    const cartProducts = loadCart();

    const newCartItem = {
      id: cartProducts.length ? cartProducts[cartProducts.length - 1].id + 1 : 1,
      userId,
      productId,
      quantity: quantity && quantity > 0 ? quantity : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    cartProducts.push(newCartItem);
    saveCart(cartProducts);

    res.status(201).json({
      success: true,
      data: newCartItem,
      message: "Product added to cart successfully",
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const cartProducts = loadCart();

    const userCart = cartProducts.filter(
      (item) => String(item.userId) === String(userId) && item.deletedAt === null
    );

    if (userCart.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No products found for this user",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: userCart,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Cart item id is required" });
    }

    const cartProducts = loadCart();
    const cartIndex = cartProducts.findIndex((item) => item.id === Number(id) && item.deletedAt === null);

    if (cartIndex === -1) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    if (quantity && quantity > 0) {
      cartProducts[cartIndex].quantity = quantity;
    }

    cartProducts[cartIndex].updatedAt = new Date().toISOString();
    saveCart(cartProducts);

    res.status(200).json({
      success: true,
      data: cartProducts[cartIndex],
      message: "Cart item updated successfully",
    });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Cart item id is required" });
    }

    const cartProducts = loadCart();
    const cartIndex = cartProducts.findIndex((item) => item.id === Number(id) && item.deletedAt === null);

    if (cartIndex === -1) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    cartProducts[cartIndex].deletedAt = new Date().toISOString();
    saveCart(cartProducts);

    res.status(200).json({
      success: true,
      message: "Cart product deleted successfully",
    });
  } catch (err) {
    console.error("Delete cart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addToCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
};
