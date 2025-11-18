const Shipping = require("../models/shipping/shipping");

const addShippingInfo = async (req, res) => {
  const { name, email, address, userId } = req.body;

  if (!address || !userId) {
  return res.status(400).json({ success: false, message: "Address and userId are required" });
}


  try {
    const shippingAddress = await Shipping.create({
      name,
      email,
      address,
      userId,
    });
    return res
      .status(201)
      .json({
        success: true,
        data: shippingAddress,
        message: "Data saved successfully",
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addShippingInfo,
};
