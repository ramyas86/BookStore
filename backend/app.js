const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');
const genreRoutes  = require('./routes/genres');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', bookRoutes);
app.use('/api', authorRoutes);
app.use('/api', genreRoutes);

app.use('/upload', uploadRoutes); //used to upload routes

sequelize.sync().then(() => {
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

// Database connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Server start
app.listen(PORT, console.log(`Server started on port ${PORT}`));
