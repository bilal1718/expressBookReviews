const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // If everything is okay, add the user to the users object
  users[username] = password;

  return res.status(201).json({ message: 'User registered successfully, Now you can login' });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).json({ books: books });
});

// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from request parameters
  const book = books[isbn];

  if (book) {
    res.status(200).json(book); // Send the book details as JSON response
  } else {
    res.status(404).json({ message: 'Book not found' }); // If the book with the given ISBN is not found
  }
});

// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorToFind = req.params.author; // Retrieve the author from request parameters

  const matchingBooks = Object.keys(books).reduce((result, isbn) => {
    const book = books[isbn];
    if (book.author === authorToFind) {
      result[isbn] = book;
    }
    return result;
  }, {});

  if (Object.keys(matchingBooks).length > 0) {
    res.status(200).json(matchingBooks); // Send the matching books as JSON response
  } else {
    res.status(404).json({ message: 'Books by author not found' }); // If no matching books are found
  }
});


// Get all books based on title
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const titleToFind = req.params.title; // Retrieve the title from request parameters

  const matchingBooks = Object.keys(books).reduce((result, isbn) => {
    const book = books[isbn];
    if (book.title === titleToFind) {
      result[isbn] = book;
    }
    return result;
  }, {});

  if (Object.keys(matchingBooks).length > 0) {
    res.status(200).json(matchingBooks); // Send the matching books as JSON response
  } else {
    res.status(404).json({ message: 'Books by title not found' }); // If no matching books are found
  }
});


//  Get book review
// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from request parameters
  const book = books[isbn];

  if (book && book.reviews) {
    res.status(200).json(book.reviews); // Send the book reviews as JSON response
  } else {
    res.status(404).json({ message: 'Book reviews not found' }); // If the book or its reviews are not found
  }
});

module.exports.general = public_users;
