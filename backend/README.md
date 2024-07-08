# Bookstore 

Part 1: Building the Node.js Back-end with Express, CORS, and Sequelize
1. Setting up the Project
Initialize the project:

2. Install dependencies: 
Create a new directory for your project.
Navigate to the directory in your terminal.
Initialize a new Node.js project with npm init -y.

cd backend
npm init -y
npm install express cors sequelize body-parser mysql2
npm install --save-dev nodemon

3. Project structure:

Create the following structure:
bookstore/backend/
├── config/
│   └── database.js
├── models/
│   ├── book.js
│   ├── author.js
│   └── genre.js
├── seeders/
│   └── seed.js
├── routes/
│   ├── books.js
│   ├── authors.js
│   └── genres.js
├── controllers/
│   ├── bookController.js
│   ├── authorController.js
│   └── genreController.js
├── app.js
└── package.json

4. Create the database and insert sample data:
node seeders/seed.js

5. Running the Server
In your package.json, add a script to run the server using nodemon:

"scripts": {
  "start": "nodemon app.js",
  "seed": "node seeders/seed.js"
}

6. To run the server: npm start

7. To seed the database: npm run seed


Endpoints
Books
GET /books : Retrieve a list of all books
GET /books/{book_id} : Retrieve details of a specific book
POST /books : Add a new book
PUT /books/{book_id} : Update details of an existing book
DELETE /books/{book_id} : Delete a specific book
Authors
GET /authors : Retrieve a list of all authors
GET /authors/{author_id} : Retrieve details of a specific author
POST /authors : Add a new author
PUT /authors/{author_id} : Update details of an existing author
DELETE /authors/{author_id} : Delete a specific author
Genres
GET /genres : Retrieve a list of all genres
GET /genres/{genre_id} : Retrieve details of a specific genre
POST /genres : Add a new genre


Part 2: Building the Front-end with React
1. Setting up the React Project
Initialize the React project: cd bookstore
npx create-react-app frontend
cd frontend
npm install axios react-router-dom

2. Project Structure:
bookstore/frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── HomePage.js
│   │   ├── BooksPage.js
│   │   ├── AuthorsPage.js
│   │   ├── BookDetails.js
│   │   ├── AuthorDetails.js
│   │   ├── AddBookForm.js
│   │   ├── EditBookForm.js
│   │   ├── AddAuthorForm.js
│   │   ├── EditAuthorForm.js
│   ├── App.js
│   ├── index.js
│   ├── api.js
├── package.json
├── README.md


