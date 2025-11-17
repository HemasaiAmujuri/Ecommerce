const { Sequelize } = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect : 'postgres',
  protocol: 'postgres',
  dialect: 'mysql',
  logging: false, 
  dialectOptions : {
    ssl : {
      require : false,
      rejectUnauthorized : false
    }
  }
},
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL database.');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
})();

module.exports = sequelize;
