require('dotenv').config();

module.exports = {
    development: {
        dialect: "postgres",
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
    },
};
