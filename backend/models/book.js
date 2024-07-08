const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Author = require('./author');
const Genre = require('./genre');

const Book = sequelize.define('Book', {
  book_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty'
      }
    }
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Author,
      key: 'author_id',
    },
    validate: {
      isAuthorValid(value) {
        return Author.findByPk(value).then(author => {
          if (!author) {
            throw new Error('Author ID does not exist.');
          }
        });
      },
      notEmpty: {
        msg: 'Author ID cannot be empty'
      },
      isInt: {
        msg: 'Author ID must be an integer'
      },
      notNull: {
        msg: 'Author ID is required'
      }
    }
  },
  genre_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Genre,
      key: 'genre_id',
    },
    validate: {
      isAuthorValid(value) {
        return Genre.findByPk(value).then(genre => {
          if (!genre) {
            throw new Error('Genre does not exist.');
          }
        });
      },
      notEmpty: {
        msg: 'Genre ID cannot be empty'
      },
      isInt: {
        msg: 'Genre ID must be an integer'
      },
      notNull: {
        msg: 'Genre ID is required'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Price should be a number'
      }
    }
  },
  publication_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Publication date must be a valid date'
      }
    }
  },
},
{
  hooks: {
    beforeCreate: (book, options) => {
      // trim values and check for empty
      // does user exists
      // Does Genre exist


      console.log('Before creating a book:', book)
    },
    beforeUpdate: (book, options) => {
      console.log('Before creating a book:', book)
      console.log(book);
      console.log(options);

    }
  }
});

Book.belongsTo(Author, { foreignKey: 'author_id' });
Book.belongsTo(Genre, { foreignKey: 'genre_id' });

Author.hasMany(Book, { foreignKey: 'author_id' });
Genre.hasMany(Book, { foreignKey: 'genre_id' });

module.exports = Book;
