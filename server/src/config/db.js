const { Sequelize } = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect : 'postgres',
  protocol: 'postgres',
  logging: false, 
  dialectOptions : {
    ssl : {
      require : true,
      rejectUnauthorized : false
    }
  }
},
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database.');

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
})();

module.exports = sequelize;
