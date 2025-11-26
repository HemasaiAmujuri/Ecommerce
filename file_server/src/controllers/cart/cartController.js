const fs = require("fs");
const path = require("path");

const cartDataFile = path.join(__dirname, "../../data/cart.json");
const productsDataFile = path.join(__dirname, "../../data/products.json");

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


const loadProducts = () => {
  if (!fs.existsSync(productsDataFile)) return [];
  const content = fs.readFileSync(productsDataFile, "utf-8");
  return JSON.parse(content);
}

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
      (item) => Number(item.userId) === Number(userId) && item.deletedAt === null
    );

    if (userCart.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No products found for this user",
        data: [],
      });
    }

    const allProducts = loadProducts();

    const detailedCart = userCart.map((cartItem) => {
      const product = allProducts.find(
        (p) => Number(p.id) === Number(cartItem.productId)
      );

       if (!product) {
    return null;
  }
        return {
        ...product,
        quantity : cartItem.quantity ?? product?.quantity ?? 1
      };
    });

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: detailedCart,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getCartByUserId };




const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Cart item id is required" });
    }

    const cartProducts = loadCart();
    const cartIndex = cartProducts.findIndex(
      (item) => item.id === Number(id) && item.deletedAt === null
    );

    if (cartIndex === -1) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    if (quantity && quantity > 0) {
      cartProducts[cartIndex].quantity = quantity;
    }

    cartProducts[cartIndex].updatedAt = new Date().toISOString();
    saveCart(cartProducts);

    return res.status(200).json({
      success: true,
      data: cartProducts[cartIndex],
      message: "Cart item updated successfully",
    });
  } catch (err) {
    console.error("Update cart error:", err);
    return res.status(500).json({ success: false, message: err.message });
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



const deleteUserCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const cartProducts = loadCart();

    const userCartItems = cartProducts.filter(
      (item) => item.userId === Number(userId) && item.deletedAt === null
    );

    if (userCartItems.length === 0) {
      return res.status(404).json({ success: false, message: "No cart items found for this user" });
    }

    const updatedCart = cartProducts.map((item) => {
      if (item.userId === Number(userId) && item.deletedAt === null) {
        return { ...item, deletedAt: new Date().toISOString() };
      }
      return item;
    });

    saveCart(updatedCart);

    res.status(200).json({
      success: true,
      message: "All cart items for this user deleted successfully",
    });
  } catch (err) {
    console.error("Delete user cart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


const addOrUpdateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "userId, productId, and valid quantity are required",
      });
    }

    const cartProducts = loadCart();
    const existingIndex = cartProducts.findIndex(
      (item) =>
        item.userId === Number(userId) &&
        item.productId === Number(productId) &&
        item.deletedAt === null
    );

    if (existingIndex !== -1) {
      cartProducts[existingIndex].quantity = Number(quantity);
      cartProducts[existingIndex].updatedAt = new Date().toISOString();

      saveCart(cartProducts);

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
        data: cartProducts[existingIndex],
      });
    } else {
      const newItem = {
        id: cartProducts.length ? cartProducts[cartProducts.length - 1].id + 1 : 1,
        userId: Number(userId),
        productId: Number(productId),
        quantity: Number(quantity),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };

      cartProducts.push(newItem);
      saveCart(cartProducts);

      return res.status(201).json({
        success: true,
        message: "New product added to cart successfully",
        data: newItem,
      });
    }
  } catch (err) {
    console.error("Add/Update cart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



module.exports = {
  addToCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  deleteUserCartItems,
  addOrUpdateCartItem
};
