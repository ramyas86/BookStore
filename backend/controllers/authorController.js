const { where } = require('sequelize');
const Author = require('../models/author');
const Book = require('../models/book');
const { Op } = require('sequelize');

exports.getAuthors = async (req, res) => {
  try {
    const { letter, page = 1, limit = 10 } = req.query;
    const wherClause = letter ? { name: { [Op.startsWith]: letter } } : {};
    const offset = (page - 1) * limit;

    const { count, rows: authors }  = await Author.findAndCountAll({
      where: wherClause,
      offset: parseInt(offset),
      limit: parseInt(limit),
   });
    res.json({
      authors,
      totalPages: Math.ceil(count / limit)  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.author_id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ error: 'Author not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addAuthor = async (req, res) => {
  try {
    const newAuthor = await Author.create(req.body);
    res.status(201).json({
      message: 'Author added successfully',
      author: newAuthor
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.author_id);
    if (author) {
      await author.update(req.body);
      res.status(200).json({
        message: 'Author updated successfully',
        auth: author
      });
    } else {
      res.status(404).json({ error: 'Author not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    const authorId = req.params.author_id;

    // Check if there are any books associated with this author
    const books = await Book.findAll({ where: { author_id: authorId } });
    console.log(books);
    if (books.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete author because there are books associated with this author.'
      });
    }

    // If no books are associated, delete the author
    const result = await Author.destroy({ where: { author_id: authorId } });

    if (result) {
      return res.status(200).json({ message: 'Author deleted successfully.' });
    } else {
      return res.status(404).json({ error: 'Author not found.' });
    }

  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while trying to delete the author.' });
  }
};
