const express = require("express");

module.exports = (db) => {
    const router = express.Router();

    // Add a Member
    router.post("/", (req, res) => {
        const { name, email, phoneNumber } = req.body;
        const query = `INSERT INTO Members (Name, Email, PhoneNumber) VALUES (?, ?, ?)`;
        db.run(query, [name, email, phoneNumber], function (err) {
            if (err) return res.status(500).send(err.message);
            res.status(201).json({ MemberID: this.lastID });
        });
    });

    // Member Borrowing History
    router.get("/:memberID/history", (req, res) => {
        const memberID = req.params.memberID;
        const query = `
            SELECT Books.Title, BorrowingRecords.BorrowDate, BorrowingRecords.ReturnDate
            FROM BorrowingRecords
            INNER JOIN Books ON BorrowingRecords.BookID = Books.BookID
            WHERE BorrowingRecords.MemberID = ?`;
        db.all(query, [memberID], (err, rows) => {
            if (err) return res.status(500).send(err.message);
            res.json(rows);
        });
    });

    return router;
};
