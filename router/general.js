const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  for (const isbn in books) {
    if (books[isbn].author === author) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author." });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  for (const isbn in books) {
    if (books[isbn].title === title) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this title." });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ✅ Task 10: Get all books using an async callback
public_users.get('/books-async', function (req, res) {
  function getBooks(callback) {
    setTimeout(() => {
      callback(null, books); // Simulate async delay
    }, 100);
  }

  getBooks((err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get books." });
    } else {
      return res.status(200).json(result);
    }
  });
});

// ✅ Task 11: Search by ISBN using Promises
public_users.get('/promise/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      }, 100); // Simulate async delay
    });
  }

  getBookByISBN(isbn)
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// ✅ Task 12: Search by author using Promises
public_users.get('/promise/author/:author', function (req, res) {
  const author = req.params.author;

  function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const results = [];

        for (const isbn in books) {
          if (books[isbn].author === author) {
            results.push({ isbn, ...books[isbn] });
          }
        }

        if (results.length > 0) {
          resolve(results);
        } else {
          reject("No books found for this author");
        }
      }, 100); // Simulate async delay
    });
  }

  getBooksByAuthor(author)
    .then((booksByAuthor) => res.status(200).json(booksByAuthor))
    .catch((err) => res.status(404).json({ message: err }));
});

// ✅ Task 13: Search by title using Promises
public_users.get('/promise/title/:title', function (req, res) {
  const title = req.params.title;

  function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const results = [];

        for (const isbn in books) {
          if (books[isbn].title === title) {
            results.push({ isbn, ...books[isbn] });
          }
        }

        if (results.length > 0) {
          resolve(results);
        } else {
          reject("No books found with this title");
        }
      }, 100); // Simulate async delay
    });
  }

  getBooksByTitle(title)
    .then((booksByTitle) => res.status(200).json(booksByTitle))
    .catch((err) => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
