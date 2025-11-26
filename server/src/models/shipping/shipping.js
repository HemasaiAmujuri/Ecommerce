const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Shipping = sequelize.define(
  "shippings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name : {
      type : DataTypes.STRING,
      allowNull:false
    },
    email : {
      type : DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model : "users", 
        key : "id"
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: true, paranoid: true }
);

module.exports = Shipping;
