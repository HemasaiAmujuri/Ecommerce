const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");


const Cart = sequelize.define("carts", {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        references : {
            model : "users",
            key : 'id'
        }
    },
    productId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        references:  {
            model : "products",
            key : 'id'
        }
    },
    quantity : {
        type : DataTypes.INTEGER,
        defaultValue : 1
    },
   },{
        timestamps : true,
        paranoid : true
    }
);



module.exports = Cart;