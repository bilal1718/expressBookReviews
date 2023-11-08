const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Array to store registered users
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Verify if the user is authenticated
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Get the ISBN from the request parameters
  const isbn = req.params.isbn;
  
  // Get the review from the request query
  const review = req.query.review;

  // Check if a review for that ISBN already exists for the user
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Modify the existing review or add a new one
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: 'Review added or modified successfully' });
});
const isValid = (username) => {
  // Write code to check if the username is valid
  return !!users.find(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Write code to check if the username and password match the records
  const user = users.find(user => user.username === username && user.password === password);
  return !!user;
};

// Login for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the username and password match the records
  if (authenticatedUser(username, password)) {
    // If the login is successful, create a JWT token for the session
    const token = jwt.sign({ username },`eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5OTQzMTQ3MywiaWF0IjoxNjk5NDMxNDczfQ.3labgbijPTQosiMzcnnKWkr7z-leZo4ApzN6mQkINyc`);

    return res.status(200).json({ message: 'Login successful', token });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Verify if the user is authenticated
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Retrieve the username from the JWT token
  const decoded = jwt.decode(token);
  const username = decoded.username;

  // Get the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if a review for that ISBN exists
  if (!books[isbn] || !books[isbn].reviews) {
    return res.status(404).json({ message: 'Book or review not found' });
  }

  // Check if the user has a review for the book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: 'Review not found for this user' });
  }

  // Delete the user's review for the book
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
