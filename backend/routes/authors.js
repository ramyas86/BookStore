const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

router.get('/authors', authorController.getAuthors);
router.get('/authors/:author_id', authorController.getAuthorById);
router.post('/authors', authorController.addAuthor);
router.put('/authors/:author_id', authorController.updateAuthor);
router.delete('/authors/:author_id', authorController.deleteAuthor);

module.exports = router;