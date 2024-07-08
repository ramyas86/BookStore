const sequelize = require('../database');
const Book = require('../models/book');

async function testErrors() {
  await sequelize.sync();
  const books = await Book.create(
    {
      title: 'Book 3',
      author_id: 999,
      genre_id: 1,
      price: 10.99,
      publication_date: '2021-01-01',
    }
  );
  console.log('Book with Invalid User : ' + books);

  const books2 = await Book.create(
    {
      title: 'Book 3',
      author_id: 1,
      genre_id: 999,
      price: 10.99,
      publication_date: '2021-01-01',
    }
  );

  console.log('Book with Invalid Genere : ' + books2);
  await sequelize.close();
}

testErrors().catch(err => console.error(err));
