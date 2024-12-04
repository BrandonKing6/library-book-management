const express = require("express");

module.exports = (db) => {
    const router = express.Router();

    // Borrow a Book
    router.post("/borrow", (req, res) => {
        const { memberID, bookID } = req.body;
        const borrowQuery = `INSERT INTO BorrowingRecords (MemberID, BookID) VALUES (?, ?)`;
        const updateQuery = `UPDATE Books SET IsAvailable = 0 WHERE BookID = ?`;

        db.run(borrowQuery, [memberID, bookID], function (err) {
            if (err) return res.status(500).send(err.message);

            db.run(updateQuery, [bookID], (err) => {
                if (err) return res.status(500).send(err.message);
                res.status(200).send("Book borrowed successfully.");
            });
        });
    });

    // Return a Book
    router.post("/return", (req, res) => {
        const { recordID } = req.body;
        const returnQuery = `UPDATE BorrowingRecords SET ReturnDate = CURRENT_DATE WHERE RecordID = ?`;
        const updateQuery = `UPDATE Books SET IsAvailable = 1 WHERE BookID = (
            SELECT BookID FROM BorrowingRecords WHERE RecordID = ?)`;

        db.run(returnQuery, [recordID], function (err) {
            if (err) return res.status(500).send(err.message);

            db.run(updateQuery, [recordID], (err) => {
                if (err) return res.status(500).send(err.message);
                res.status(200).send("Book returned successfully.");
            });
        });
    });

    return router;
};
