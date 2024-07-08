const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/search/title', searchController.searchBooksByTitle);
router.get('/search/author', searchController.searchBooksByAuthor);
router.get('/search/genre', searchController.searchBooksByGenre);

module.exports = router;
