const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const formatName = require('../utils/formatName');

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({ include: [Author, Genre] });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.book_id, { include: [Author, Genre] });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json({
      message: 'Book created successfully',
      book: newBook
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.book_id);
    if (book) {
      console.log(req.body);
      await book.update(req.body);
      res.status(200).json({
        message: 'Book updated successfully',
        book: book
    });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.book_id);
    if (book) {
      await book.destroy();
      res.status(200).json({ message: 'Book deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
