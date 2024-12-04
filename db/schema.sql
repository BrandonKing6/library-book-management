-- Creating Books table
CREATE TABLE IF NOT EXISTS Books (
  BookID INTEGER PRIMARY KEY AUTOINCREMENT,
  Title TEXT NOT NULL,
  Author TEXT NOT NULL,
  Genre TEXT,
  YearPublished INTEGER,
  IsAvailable BOOLEAN DEFAULT 1
);

-- Creating Members table
CREATE TABLE IF NOT EXISTS Members (
  MemberID INTEGER PRIMARY KEY AUTOINCREMENT,
  Name TEXT NOT NULL,
  Email TEXT UNIQUE,
  PhoneNumber TEXT UNIQUE,
  MembershipDate DATE DEFAULT CURRENT_DATE
);

-- Creating BorrowingRecords table
CREATE TABLE IF NOT EXISTS BorrowingRecords (
  RecordID INTEGER PRIMARY KEY AUTOINCREMENT,
  MemberID INTEGER,
  BookID INTEGER,
  BorrowDate DATE DEFAULT CURRENT_DATE,
  ReturnDate DATE,
  FOREIGN KEY (MemberID) REFERENCES Members(MemberID),
  FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

-- Inserting sample data into Books
INSERT INTO Books (Title, Author, Genre, YearPublished, IsAvailable)
VALUES 
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 1925, 1),
  ('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 1960, 1),
  ('1984', 'George Orwell', 'Dystopian', 1949, 1),
  ('Moby Dick', 'Herman Melville', 'Adventure', 1851, 1);

-- Inserting sample data into Members
INSERT INTO Members (Name, Email, PhoneNumber)
VALUES 
  ('John Snow', 'john@example.com', '1234567890'),
  ('George Ship', 'george@example.com', '0987654321');

-- Inserting sample borrowing record
INSERT INTO BorrowingRecords (MemberID, BookID, BorrowDate)
VALUES 
  (1, 1, '2024-11-01'),
  (2, 3, '2024-11-02');
