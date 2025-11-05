const fs = require("fs");
const path = require("path");

const shippingDataFile = path.join(__dirname, "../../data/shipping.json");  



const load = () => (fs.existsSync(shippingDataFile) ? JSON.parse(fs.readFileSync(shippingDataFile, "utf8")) : []);
const save = (data) => fs.writeFileSync(shippingDataFile, JSON.stringify(data, null, 2), "utf8");

const createShipping = async (req, res) => {
  try {
    const { userId, name, email, address } = req.body;

    if (!userId || !address ||!name || !email)
      return res.status(400).json({ success: false, message: "userId and address are required" });

    const data = load();
    const newShipping = {
      id: data.length ? data[data.length - 1].id + 1 : 1,
      userId,
      name,
      email,
      address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    data.push(newShipping);
    save(data);

    res.status(201).json({
      success: true,
      data: newShipping,
      message: "Data created successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



module.exports = {
  createShipping,
};
