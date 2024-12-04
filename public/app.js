async function loadAvailableBooks() {
    const response = await fetch('/api/books/available');
    const availableBooks = await response.json();
  
    const availableBooksList = document.getElementById('available-books-list');
    availableBooksList.innerHTML = ''; // Clear previous list
  
    if (availableBooks.length === 0) {
      availableBooksList.innerHTML = '<p>No available books.</p>';
    } else {
      availableBooks.forEach(book => {
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
          <p><strong>Status:</strong> Borrowed</p>
        `;
        borrowedBooksList.appendChild(bookCard);
      });
    }
  }
  
  async function borrowBook(bookId) {
    const memberId = 1; // Use an example member ID for now
    const response = await fetch('/api/borrow-book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, bookId })
    });
  
    if (response.ok) {
      alert('Book borrowed successfully!');
      loadAvailableBooks(); // Reload the available books list
      loadBorrowedBooks();  // Reload the borrowed books list
    } else {
      alert('Error borrowing book.');
    }
  }
  
  window.onload = function() {
    loadAvailableBooks();           // Load available books on page load
    loadBorrowedBooks();            // Load borrowed books on page load
  };
  