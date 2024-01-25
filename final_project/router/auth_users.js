const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }

}

regd_users.get("/test", (req,res)=>{
    res.send(users)
})

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

//testing ruote
regd_users.put("/testput/review/:isbn", (req,res)=>{
    // let isbn = req.params.isbn;
    // res.send("ruote it's ok finish "+isbn)
    
    const username = req.session.authorization.username; // Get username from session
    const isbn = req.params.isbn;
    const reviewText = req.body.review;
  
    if (!username || !isbn || !reviewText) {
      return res.status(400).json({ message: "Invalid request. Please provide username, ISBN, and review text." });
    }
  
    // Check if the book with the specified ISBN exists
    if (!books.hasOwnProperty(isbn)) {
      return res.status(404).json({ message: "Book not found for the specified ISBN" });
    }
  
    // Check if the user has already posted a review for the same ISBN
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // Modify existing review
      books[isbn].reviews[username] = reviewText;
      return res.status(200).json({ message: "Review updated successfully" });
    }
  
    // Add a new review for the ISBN and user
    books[isbn].reviews[username] = reviewText;
    return res.status(200).json({ message: "Review added successfully" });


})


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    res.send("got it")
    // const username = req.session.authorization.username; // Get username from session
    // const isbn = req.params.isbn;
    // const reviewText = req.body.review;
  
    // if (!username || !isbn || !reviewText) {
    //   return res.status(400).json({ message: "Invalid request. Please provide username, ISBN, and review text." });
    // }
  
    // // Check if the book with the specified ISBN exists
    // if (!books.hasOwnProperty(isbn)) {
    //   return res.status(404).json({ message: "Book not found for the specified ISBN" });
    // }
  
    // // Check if the user has already posted a review for the same ISBN
    // if (books[isbn].reviews.hasOwnProperty(username)) {
    //   // Modify existing review
    //   books[isbn].reviews[username] = reviewText;
    //   return res.status(200).json({ message: "Review updated successfully" });
    // }
  
    // // Add a new review for the ISBN and user
    // books[isbn].reviews[username] = reviewText;
    // return res.status(200).json({ message: "Review added successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username; // Get username from session
    const isbn = req.params.isbn;
  
    if (!username || !isbn) {
      return res.status(400).json({ message: "Invalid request. Please provide username and ISBN." });
    }
  
    // Check if the book with the specified ISBN exists
    if (!books.hasOwnProperty(isbn)) {
      return res.status(404).json({ message: "Book not found for the specified ISBN" });
    }
  
    // Check if the user has a review for the same ISBN
    if (!books[isbn].reviews.hasOwnProperty(username)) {
      return res.status(404).json({ message: "Review not found for the specified user and ISBN" });
    }
  
    // Delete the user's review for the specified ISBN
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
