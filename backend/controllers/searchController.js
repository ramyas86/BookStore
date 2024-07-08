const { Op } = require('sequelize');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');

exports.searchBooksByTitle = async (req, res) => {
  console.log('Searching books by title:', req.query.query);
  try {
    const { query } = req.query;
    const books = await Book.findAll({
      where: {
        title: {
          [Op.like]: `%${query}%`,
        },
      },
      include: [Author, Genre],
    });
    console.log(JSON.stringify(books));
    console.log(json(books));
    res.json(books);
  } catch (error) {
    console.error('Error searching books by title:', error);
    res.status(500).json({ message: 'Error searching books by title' });
  }
};

exports.searchBooksByAuthor = async (req, res) => {
  try {
    const { query } = req.query;
    const authors = await Author.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
      include: [Book],
    });

    const books = authors.flatMap(author => author.Books);
    res.json(books);
  } catch (error) {
    console.error('Error searching books by author:', error);
    res.status(500).json({ message: 'Error searching books by author' });
  }
};

exports.searchBooksByGenre = async (req, res) => {
  try {
    const { query } = req.query;
    const genres = await Genre.findAll({
      where: {
        genre_name: {
          [Op.like]: `%${query}%`,
        },
      },
      include: [Book],
    });

    const books = genres.flatMap(genre => genre.Books);
    res.json(books);
  } catch (error) {
    console.error('Error searching books by genre:', error);
    res.status(500).json({ message: 'Error searching books by genre' });
  }
};
