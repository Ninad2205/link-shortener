const Url = require("../models/Url");
const validUrl = require("valid-url");
const shortid = require("shortid");

// Render the homepage (GET request)
exports.renderHomePage = async (req, res) => {
    try {
        res.render("index", {
            shortUrl: null,
            error: null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Create Short URL (POST request)
exports.createShortUrl = async (req, res) => {
    const { originalUrl } = req.body;

    // Validate URL
    if (!validUrl.isUri(originalUrl)) {
        return res.render("index", {
            error: "Invalid URL",
            shortUrl: null,
        });
    }

    // Check if URL already exists
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
        return res.render("index", {
            shortUrl: `https://ninad.at/${existingUrl.shortUrl}`, // Display shubh.at
            actualLink: `http://localhost:5000/${existingUrl.shortUrl}`, // Actual redirect link
            error: null,
        });
    }

    // Generate a new short URL
    const shortUrl = shortid.generate();

    try {
        const newUrl = new Url({
            originalUrl,
            shortUrl,
        });

        await newUrl.save();
        // Render the view with the newly created short URL
        res.render("index", {
            shortUrl: `https://ninad.at/${shortUrl}`, // Display shubh.at
            actualLink: `https://link-mint.vercel.app/${shortUrl}`, // Actual redirect link
            error: null,
        });
    } catch (err) {
        console.error(err);
        res.render("index", {
            error: "Error creating short URL",
            shortUrl: null,
        });
    }
};

// Redirect to the original URL based on the short URL
exports.redirectToOriginal = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });

        if (url) {
            return res.redirect(url.originalUrl);
        }

        res.status(404).render("index", {
            error: "Short URL not found",
            shortUrl: null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("index", {
            error: "Server Error",
            shortUrl: null,
        });
    }
};
