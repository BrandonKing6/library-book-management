async function loadBooks() {
  const response = await fetch('/api/books/available');
  const books = await response.json();

  const availableBooksList = document.getElementById('available-books-list');
  availableBooksList.innerHTML = ''; // Clear previous list

  if (books.length === 0) {
    availableBooksList.innerHTML = '<p>No available books.</p>';
  } else {
    books.forEach(book => {
      const bookCard = document.createElement('div');
      bookCard.className = 'book-card';
      bookCard.innerHTML = `
        <h3>${book.Title}</h3>
        <p><strong>Author:</strong> ${book.Author}</p>
        <p><strong>Genre:</strong> ${book.Genre}</p>
        <p><strong>Year Published:</strong> ${book.YearPublished}</p>
        <button onclick="borrowBook(${book.BookID})">Borrow</button>
      `;
      availableBooksList.appendChild(bookCard);
    });
  }
}

async function loadBorrowedBooks() {
  const response = await fetch('/api/borrowed-books');
  const borrowedBooks = await response.json();

  const borrowedBooksList = document.getElementById('borrowed-books-list');
  borrowedBooksList.innerHTML = ''; // Clear previous list

  if (borrowedBooks.length === 0) {
    borrowedBooksList.innerHTML = '<p>No borrowed books.</p>';
  } else {
    borrowedBooks.forEach(book => {
      const bookCard = document.createElement('div');
      bookCard.className = 'book-card';
      bookCard.innerHTML = `
        <h3>${book.Title}</h3>
        <p><strong>Author:</strong> ${book.Author}</p>
        <p><strong>Genre:</strong> ${book.Genre}</p>
        <p><strong>Year Published:</strong> ${book.YearPublished}</p>
        <button onclick="returnBook(${book.BookID})">Return</button>
      `;
      borrowedBooksList.appendChild(bookCard);
    });
  }
}

async function borrowBook(bookId) {
  const memberId = 1; // Static member ID for now
  const response = await fetch('/api/borrow-book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookId, memberId })
  });

  if (response.ok) {
    loadBooks();
    loadBorrowedBooks();
  } else {
    alert('Failed to borrow the book');
  }
}

async function returnBook(bookId) {
  const response = await fetch('/api/return-book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookId })
  });

  if (response.ok) {
    loadBooks();
    loadBorrowedBooks();
  } else {
    alert('Failed to return the book');
  }
}

window.onload = function() {
  loadBooks();
  loadBorrowedBooks();
};