const Genre = require('../models/genre');


exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.genre_id);
    if (genre) {
      res.json(genre);
    } else {
      res.status(404).json({ error: 'Genre not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addGenre = async (req, res) => {
  const { genre_name } = req.body;
  // Manual validation
  if (!genre_name || genre_name.trim() === '') {
    return res.status(400).json({ error: 'Genre name cannot be empty' });
  }

  try {
    const newGenre = await Genre.create({ genre_name });
    res.status(201).json({
      message: 'Genre created successfully',
      genre: newGenre
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Genre name must be unique' });
    }
    res.status(400).json({ error: error.message });
  }
};