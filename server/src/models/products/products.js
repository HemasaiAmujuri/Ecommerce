const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");


const Products = sequelize.define("products", {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true
    },
    title : {
        type : DataTypes.STRING(200),
        allowNull : false,
    },
    description : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    category : {
        type : DataTypes.ENUM('beauty',
  'fragrances',
  'furniture',
  'groceries',
  'home-decoration',
  'kitchen-accessories',
  'laptops',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'mobile-accessories',
  'motorcycle',
  'skin-care',
  'smartphones',
  'sports-accessories',
  'sunglasses',
  'tablets',
  'tops',
  'vehicle',
  'womens-bags',
  'womens-dresses',
  'womens-jewellery',
  'womens-shoes',
  'womens-watches'),
        allowNull : false,

    },
    imgUrl : {
        type : DataTypes.TEXT,
        allowNull : false,
    },
    price : {
        type : DataTypes.DECIMAL(10,2),
        allowNull : false
    }},
    {
    timestamps: false, 
  }
);


module.exports = Products;