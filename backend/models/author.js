const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Author = sequelize.define('Author', {
  author_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Author Name cannot be empty'
      },
      notNull: {
        msg: 'Author Name cannot be null'
      }
    }
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Biography cannot be empty'
      },
      notNull: {
        msg: 'Biography cannot be null'
      }
    }
  },
  imagePath: {
    type: DataTypes.STRING,   // Storing image paths
    allowNull: true // or false based on whether imagePath is required
  },
});

module.exports = Author;
