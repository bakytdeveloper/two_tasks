const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
    }
);

const Product = require('./Product')(sequelize, DataTypes);
const Stock = require('./Stock')(sequelize, DataTypes);

// Устанавливаем ассоциации после загрузки всех моделей
Product.hasMany(Stock, { foreignKey: 'product_id', as: 'stocks' });
Stock.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

const db = {
    sequelize,
    Sequelize,
    Product,
    Stock,
};

module.exports = db;
