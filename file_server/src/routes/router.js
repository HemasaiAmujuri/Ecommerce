const express = require("express")
const router = express.Router();

const { register, login } = require('../controllers/users/userController');
const { products, singleProduct }  = require("../controllers/products/products")
const { createShipping } = require("../controllers/shipping/shippingController")




router.post('/user/register', register);
router.post('/user/login', login);
router.get('/products/all-products', products);
router.get('/products/singleProduct/:id', singleProduct);
router.post('/shipping/add-shippingInfo', createShipping )


module.exports = router;