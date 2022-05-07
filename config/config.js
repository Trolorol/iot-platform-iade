// config.js
require('dotenv').config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT } = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "sequelize_database_dev",
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres"
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "sequelize_database_test",
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres"
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "sequelize_database_prod",
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres"
  }
}
