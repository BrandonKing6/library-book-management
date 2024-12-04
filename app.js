const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Create a database connection
const db = new sqlite3.Database(path.join(__dirname, 'db', 'library.db'));

// API to get available books
app.get('/api/books/available', (req, res) => {
  const sql = 'SELECT * FROM Books WHERE IsAvailable = 1';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error retrieving available books');
    }
    res.json(rows);
  });
});

// API to get borrowed books
app.get('/api/borrowed-books', (req, res) => {
  const sql = `
    SELECT Books.BookID, Books.Title, Books.Author, Books.Genre, Books.YearPublished
    FROM Books
    JOIN BorrowingRecords ON Books.BookID = BorrowingRecords.BookID
    WHERE BorrowingRecords.ReturnDate IS NULL
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error retrieving borrowed books');
    }
    res.json(rows);
  });
});

// API to borrow a book
app.post('/api/borrow-book', (req, res) => {
  const { bookId, memberId } = req.body;
  const borrowSql = 'INSERT INTO BorrowingRecords (MemberID, BookID) VALUES (?, ?)';
  const updateSql = 'UPDATE Books SET IsAvailable = 0 WHERE BookID = ?';

  db.run(borrowSql, [memberId, bookId], function (err) {
    if (err) {
      return res.status(500).send('Error borrowing the book');
    }
    db.run(updateSql, [bookId], function (err) {
      if (err) {
        return res.status(500).send('Error updating book availability');
      }
      res.sendStatus(200);
    });
  });
});

// API to return a book
app.post('/api/return-book', (req, res) => {
  const { bookId } = req.body;
  const returnSql = 'UPDATE BorrowingRecords SET ReturnDate = CURRENT_DATE WHERE BookID = ? AND ReturnDate IS NULL';
  const updateSql = 'UPDATE Books SET IsAvailable = 1 WHERE BookID = ?';

  db.run(returnSql, [bookId], function (err) {
    if (err) {
      return res.status(500).send('Error returning the book');
    }
    db.run(updateSql, [bookId], function (err) {
      if (err) {
        return res.status(500).send('Error updating book availability');
      }
      res.sendStatus(200);
    });
  });
});

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
