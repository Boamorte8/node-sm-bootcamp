const Sequelize = require('sequelize');

const { MYSQL_NAME_DB, MYSQL_PASSWORD, MYSQL_USERNAME } = process.env;

const sequelize = new Sequelize(MYSQL_NAME_DB, MYSQL_USERNAME, MYSQL_PASSWORD, {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
