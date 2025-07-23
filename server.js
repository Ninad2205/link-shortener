const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const urlRoutes = require('./routes/urlRoutes');
const app = express();
const path = require("path");


mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("`Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB connection error:", err));





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
