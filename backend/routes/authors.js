const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Author = require('../models/author');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/authors/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
const uploadsDir = './uploads/authors/';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

router.get('/authors', authorController.getAuthors);
router.get('/authors/:author_id', authorController.getAuthorById);

// Route for adding a new author with image upload
router.post('/authors', upload.single('author_image'), async (req, res, next) => {
    try {
        if (req.file) {
            req.body.imagePath = `http://localhost:3001/uploads/authors/${req.file.filename}`;
        }

        const newAuthor = await Author.create(req.body);
        if (newAuthor) {
            return res.status(201).json({ message: 'Author created successfully', author: newAuthor });
        }

        throw new Error('Failed to create an author.');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// Route for updating an author with image upload
router.put('/authors/:author_id', upload.single('author_image'), async (req, res, next) => {
    try {
        if (req.file) {
            req.body.imagePath = `http://localhost:3001/uploads/authors/${req.file.filename}`;
        }

        const [updated] = await Author.update(req.body, {
            where: { author_id: req.params.author_id }
        });

        if (updated) {
            const updatedAuthor = await Author.findOne({ where: { author_id: req.params.author_id } });
            return res.status(200).json(updatedAuthor);
        }

        throw new Error('Author not found');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/authors/:author_id', authorController.deleteAuthor);

module.exports = router;
