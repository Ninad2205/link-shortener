const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const urlRoutes = require('./routes/urlRoutes');
const app = express();
const path = require("path");
// Database connection
mongoose.connect('mongodb://localhost/urlshortener', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Routes
app.use('/', urlRoutes);

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
