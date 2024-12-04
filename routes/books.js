const express = require("express");

module.exports = (db) => {
    const router = express.Router();

    // Add a Book
    router.post("/", (req, res) => {
        const { title, author, genre, yearPublished } = req.body;
        const query = `INSERT INTO Books (Title, Author, Genre, YearPublished) VALUES (?, ?, ?, ?)`;
        db.run(query, [title, author, genre, yearPublished], function (err) {
            if (err) return res.status(500).send(err.message);
            res.status(201).json({ BookID: this.lastID });
        });
    });

    // List Available Books
    router.get("/available", (req, res) => {
        const query = `SELECT * FROM Books WHERE IsAvailable = 1`;
        db.all(query, [], (err, rows) => {
            if (err) return res.status(500).send(err.message);
            res.json(rows);
        });
    });

    return router;
};
