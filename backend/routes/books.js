const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/book');

router.get('/books/search', bookController.searchBooks);
router.get('/books', bookController.getBooks);
router.get('/books/:book_id', bookController.getBookById);
// router.post('/books', bookController.addBook);
// router.put('/books/:book_id', bookController.updateBook);
router.delete('/books/:book_id', bookController.deleteBook);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
const uploadsDir = './uploads/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

router.post('/books', upload.single('book_image'), async (req, res, next) => {
  try {
    if (req.file) {
      req.body.imagePath = `http://localhost:3001/uploads/${req.file.filename}`;
    }

    const newBook = await Book.create(req.body);
    if (newBook) {
      return res.status(201).json({ message: 'Book created successfully', book: newBook });
    }

    throw new Error('Failed to create a book.');
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// Route for updating a book
router.put('/books/:id', upload.single('book_image'), async (req, res, next) => {
  try {
    if (req.file) {
      req.body.imagePath = `http://localhost:3001/uploads/${req.file.filename}`;
    }

    if(req.body.remove_image) {
      req.body.imagePath = null;
    }

    const [updated] = await Book.update(req.body, {
      where: { book_id: req.params.id }
    });

    if (updated) {
      const updatedBook = await Book.findOne({ where: { book_id: req.params.id } });
      return res.status(200).json(updatedBook);
    }

    throw new Error('Book not found');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;