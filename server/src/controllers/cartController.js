const Cart = require("../models/cart/cart");
const Products = require("../models/products/products");



const cartProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await Cart.findAll({ where: { userId } });
    let cartProductsList = [];
    if (data.length === 0) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    for (const item of data) {
      const product = await Products.findOne({ where: { id: item.productId } });
      if (product){ cartProductsList.push({
        ...product.dataValues, 
        quantity: item.quantity ?? 1
      });
    }
    }
    return res
      .status(200)
      .json({
        success: true,
        data: cartProductsList,
        message: "Data retrieved successfully",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId or productId" });
    }


    if (quantity < 1) {
  return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
}

    

    const existing = await Cart.findOne({ where: { userId, productId } });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res
        .status(200)
        .json({
          success: true,
          data: existing,
          message: "Cart updated successfully",
        });
    }

    const cartProduct = await Cart.create({
      userId,
      productId,
      quantity,
    });

    return res.status(201).json({
      success: true,
      data: cartProduct,
      message: "Cart Product added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



const updateCartItem = async(req,res) => {
  try{
    const { id } = req.params;
    const { quantity } = req.body;

      if (!id) {
      return res.status(400).json({ success: false, message: "Cart item id is required" });
    }

    const data = await Cart.findOne({ where : { productId: id }});

    if (!data) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    data.quantity = quantity;
    await data.save();

    return res.status(200).json({ success : true, data : data, message : "Data updated successfully"})
  }catch(err){
     return res.status(500).json({ success : false, message : err.message })
  }
}



const deleteCartItem = async(req,res) => {
  try{
  const { id } = req.params;

  const deletedCount = await Cart.destroy( { where : { productId: id }})

  if(!deletedCount){
      return res.status(404).json({ success : false, message : "Cart item not found"});
    }
    
    return res.status(200).json({ success : true, message : "Cart item deleted successfully"})
  }catch(err){
     return res.status(500).json({ success : false, message : err.message })
  }

}



const deleteCartItemsByuserId = async(req,res) => {

try{
  const userId = req.params.userId;

   if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

  const deleteCount = await Cart.destroy({ where : {userId} })

  if(!deleteCount){
     return res.status(404).json({ success: false, message: "No cart items found for this user" });
  }

  return res.status(200).json({ success : true, message : "All user cart products deleted successfully"})
}catch(err){
   res.status(500).json({ success: false, message: err.message });
}
}


const addOrUpdateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "userId, productId, and valid quantity are required",
      });
    }

    const existingItem = await Cart.findOne({
      where: { 
        userId: Number(userId), 
        productId: Number(productId) 
      },
    });

    console.log(existingItem, "existingItem");

    if (existingItem) {
      existingItem.quantity = Number(quantity);
      existingItem.updatedAt = new Date();

      await existingItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
        data: existingItem,
      });
    } else {

      const newItem = await Cart.create({
        userId: Number(userId),
        productId: Number(productId),
        quantity: Number(quantity)
      });

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
  cartProducts,
  addToCart,
  updateCartItem,
  deleteCartItem,
  deleteCartItemsByuserId,
  addOrUpdateCartItem
};
