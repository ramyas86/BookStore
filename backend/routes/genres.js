const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

router.get('/genres', genreController.getGenres);
router.get('/genres/:genre_id', genreController.getGenreById);
router.post('/genres', genreController.addGenre);

module.exports = router;
