const path = require("path");
const fs = require("fs").promises;


const PRODUCTS_FILE = path.join(__dirname, "../../data/products.json");

const products = async(req,res) => {
    try{
        
        const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
        const products = JSON.parse(data);
        return res.status(200).json({ success : true, data : products, message : "Data Retrieved successfully"})
    }catch(err){
        return res.status(500).json({ success : false, message : "failed to retrieve products" })
    }
}


const singleProduct = async(req,res) => {
    try{
    const  { id }  = req.params;
    if(!id){
        return res.status(400).json({ success : false, message : "invalid input"})
    }
    const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
    const products = JSON.parse(data);
    const product = products.find((product) => product.id === id);

    if (!product) {
  return res.status(404).json({ success: false, message: "Product not found" });
}

    return res.status(200).json({ success : true, data : product, message : "Data retrieved successfully"})
}catch(err){
    return res.status(500).json({ success : false, message : "failed to retrieve product" })
}
}


module.exports = {
    products,
    singleProduct
}


