const path = require("path");
const fs = require("fs").promises;


const PRODUCTS_FILE = path.join(__dirname, "../../data/products.json");
const CART_FILE = path.join(__dirname, "../../data/cart.json");

const products = async(req,res) => {
    try{
        
        const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
        const products = JSON.parse(data);
        return res.status(200).json({ success : true, data : products, message : "Data Retrieved successfully"})
    }catch(err){
        return res.status(500).json({ success : false, message : "failed to retrieve products" })
    }
}


const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input" });
    }

    const productsData = await fs.readFile(PRODUCTS_FILE, "utf-8");
    const products = JSON.parse(productsData);

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const cartData = await fs.readFile(CART_FILE, "utf-8");
    const cartItems = JSON.parse(cartData);

    const cartItem = cartItems.find((item) => Number(item.productId) === Number(id));

    if (cartItem) {
      product.quantity = cartItem.quantity;
    }

    return res.status(200).json({
      success: true,
      data: product,
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
    singleProduct
}


