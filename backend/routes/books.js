const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/books', bookController.getBooks);
router.get('/books/:book_id', bookController.getBookById);
router.post('/books', bookController.addBook);
router.put('/books/:book_id', bookController.updateBook);
router.delete('/books/:book_id', bookController.deleteBook);

module.exports = router;