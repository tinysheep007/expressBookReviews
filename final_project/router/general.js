const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    // Extract username and password from the request body
    const { username, password } = req.body;
  
    // Check if both username and password are provided
    if (username && password) {
      // Check if the username is already registered
      if (!isValid(username)) {
        // Register the new user
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
      } else {
        // Username already exists, return a 400 Bad Request status
        return res.status(400).json({ message: "User already exists!" });
      }
    } else {
      // Either username or password is missing, return a 400 Bad Request status
      return res.status(400).json({ message: "Username and password are required for registration." });
    }
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.status(200).send(JSON.stringify(books,null,4));
});

// Task 10
// Get the book list available in the shop
public_users.get('/asyncGetAllBooks', async function (req, res) {
    try {
      // Make an asynchronous request to fetch the list of books
      const response = await axios.get('https://pzxiaomie-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
  
      // Assuming the books are returned in the response data
      const bookList = response.data;
  
      res.status(200).json(bookList);
    } catch (error) {
      console.error('Error fetching books:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });

// Task 11
 // Get the book details based on ISBN
public_users.get('/asychIsbn/:isbn', async function (req, res) {
    try {
      // Extract ISBN from the request parameters
      const isbn = req.params.isbn;
  
      // Make an asynchronous request to fetch book details
      const response = await axios.get(`https://pzxiaomie-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`);
  
      // Assuming the book details are returned in the response data
      const bookDetails = response.data;
  
      res.status(200).json(bookDetails);
    } catch (error) {
      console.error('Error fetching book details:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
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

// Task 12
// Get the book details based on author using async-await and Axios
public_users.get('/asychauthor/:author', async function (req, res) {
    try {
      // Extract author from the request parameters
      const author = req.params.author;
  
      // Make an asynchronous request to fetch book details
      const response = await axios.get(`https://pzxiaomie-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`);
  
      // Assuming the book details are returned in the response data
      const bookDetails = response.data;
  
      if (bookDetails.length === 0) {
        return res.status(404).json({ message: `No books found for the specified author: ${author}` });
      }
  
      res.status(200).json(bookDetails);
    } catch (error) {
      console.error('Error fetching book details:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
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

// Task 13
// asych Get book reviews
// Get the book details based on title using async-await and Axios
public_users.get('/asychtitle/:title', async function (req, res) {
    try {
      // Extract title from the request parameters
      const title = req.params.title;
  
      // Make an asynchronous request to fetch book details
      const response = await axios.get(`https://pzxiaomie-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`);
  
      // Assuming the book details are returned in the response data
      const bookDetails = response.data;
  
      if (bookDetails.length === 0) {
        return res.status(404).json({ message: `No books found for the specified title: ${title}` });
      }
  
      res.status(200).json(bookDetails);
    } catch (error) {
      console.error('Error fetching book details:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


module.exports.general = public_users;
