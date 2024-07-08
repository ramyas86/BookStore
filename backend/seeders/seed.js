const sequelize = require('../config/database');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');

  const seed = async () => {
    await sequelize.sync({ force: true });

  const authors = await Author.bulkCreate([
    { name: 'J.K. Rowling', biography: 'Author of Harry Potter series' },
    { name: 'George R.R. Martin', biography: 'Author of A Song of Ice and Fire series' },
    { name: 'J.R.R. Tolkien', biography: 'Author of The Lord of the Rings.' },
    { name: 'Dan Brown', biography: 'Author of Angels & Demons, The Da Vinci Code, The Lost Symbol, Inferno, and Origin'}
  ]);

  const genres = await Genre.bulkCreate([
    { genre_name: 'Fantasy' },
    { genre_name: 'Science Fiction' },
    { genre_name: 'Adventure' },
    { genre_name: 'Mystery' }
  ]);

  const books = await Book.bulkCreate([
    {
      title: 'Harry Potter and the Philosopher\'s Stone',
      author_id: authors.find(author => author.name === 'J.K. Rowling').author_id,
      genre_id: genres.find(genre => genre.genre_name === 'Fantasy').genre_id,
      price: 15.99,
      publication_date: '1997-06-26'
    },
    {
      title: 'A Game of Thrones',
      author_id: authors.find(author => author.name === 'George R.R. Martin').author_id,
      genre_id: genres.find(genre => genre.genre_name === 'Fantasy').genre_id,
      price: 19.99,
      publication_date: '1996-08-06'
    },
    {
      title: 'The Hobbit',
      author_id: authors.find(author => author.name === 'J.R.R. Tolkien').author_id,
      genre_id: genres.find(genre => genre.genre_name === 'Fantasy').genre_id,
      price: 12.99,
      publication_date: '1937-09-21'
    },
    {
      title: 'The Da Vinci Code',
      author_id: authors.find(author => author.name === 'Dan Brown').author_id,
      genre_id: genres.find(genre => genre.genre_name === 'Mystery').genre_id,
      price: 14.99,
      publication_date: '2003-03-18'
    }

  ]);
  console.log('Database seeded successfully');
} 

seed().catch(err => console.error('Error seeding database:',err));

