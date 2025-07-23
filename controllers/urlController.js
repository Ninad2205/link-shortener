const Url = require("../models/Url");
const validUrl = require("valid-url");
const shortid = require("shortid");

const baseUrl = "https://link-mint.vercel.app";

exports.renderHomePage = async (req, res) => {
    try {
        res.render("index", {
            shortUrl: null,
            actualLink: null,
            error: null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.createShortUrl = async (req, res) => {
    const { originalUrl } = req.body;

    if (!validUrl.isUri(originalUrl)) {
        return res.render("index", {
            error: "Invalid URL format. Please enter a valid URL.",
            shortUrl: null,
            actualLink: null,
        });
    }

    try {
        const existingUrl = await Url.findOne({ originalUrl });
        if (existingUrl) {
            return res.render("index", {
                shortUrl: `${baseUrl}/${existingUrl.shortUrl}`,
                actualLink: `${baseUrl}/${existingUrl.shortUrl}`,
                error: null,
            });
        }

        let shortUrl;
        do {
            shortUrl = shortid.generate();
        } while (await Url.findOne({ shortUrl }));

        const newUrl = new Url({ originalUrl, shortUrl });
        await newUrl.save();

        res.render("index", {
            shortUrl: `${baseUrl}/${shortUrl}`,
            actualLink: `${baseUrl}/${shortUrl}`,
            error: null,
        });
    } catch (err) {
        console.error(err);
        res.render("index", {
            error: "Server error while creating short URL.",
            shortUrl: null,
            actualLink: null,
        });
    }
};

exports.redirectToOriginal = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });

        if (url) {
            return res.redirect(url.originalUrl);
        }

        res.status(404).render("index", {
            error: "Short URL not found.",
            shortUrl: null,
            actualLink: null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("index", {
            error: "Server error while redirecting.",
            shortUrl: null,
            actualLink: null,
        });
    }
};
