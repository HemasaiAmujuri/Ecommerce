const { DataTypes } = require("sequelize");
const sequelize  =  require("../../config/db");


const User = sequelize.define("users", {
    id: {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    name:  {
        type : DataTypes.STRING(30),
        allowNull : false,
        unique : true
    },
    email : {
      type : DataTypes.STRING(50),
      allowNull : false,
      unique : true,
      validate : {
        isEmail : true
      }
    },
    mobile : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    },
  { timestamps  : true, 
    paranoid : true
  },
  
);


module.exports = User;
