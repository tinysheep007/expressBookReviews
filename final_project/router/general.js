const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  // Find books with the specified author
  const matchingBooks = Object.values(books).filter(book => book.author === author);

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: 'No books found for the specified author' });
  }

  return res.status(200).json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    // Find books with the specified title
    const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  
    if (matchingBooks.length === 0) {
      // If no matching books were found, send a 404 response
      return res.status(404).json({ message: 'No books found for the specified title' });
    }
  
    // If matching books were found, send a 200 response with the list of books
    return res.status(200).json(matchingBooks);
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Check if the book with the specified ISBN exists
  if (!books.hasOwnProperty(isbn)) {
    return res.status(404).json({ message: 'Book not found for the specified ISBN' });
  }

  // Retrieve reviews for the book
  const bookReviews = books[isbn].reviews;

  if (Object.keys(bookReviews).length === 0) {
    // If no reviews are available, send a message
    return res.status(404).json({ message: 'No reviews found for the specified book' });
  }

  // If reviews are available, send a 200 response with the reviews
  return res.status(200).json(bookReviews);
});


module.exports.general = public_users;
