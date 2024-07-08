const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bookstore', 'apiuser', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;