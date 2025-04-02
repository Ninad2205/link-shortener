const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Route to render the homepage
router.get('/', urlController.renderHomePage);

// Route to create a short URL
router.post('/api/urls', urlController.createShortUrl);

// Route to redirect to the original URL based on the short URL
router.get('/:shortUrl', urlController.redirectToOriginal);

module.exports = router;
