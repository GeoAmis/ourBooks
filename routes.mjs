import express from 'express'
// use different models to demonstrate connection to different databases
import * as Validator from './validator/validation.mjs'
import * as UserController from './controller/user_controller.mjs'
import * as BookController from './controller/book_controller.mjs'

const router = express.Router()

// if there is an active session, redirect to /books
router.get("/", (req, res) => {
    if (req.session.username)
        res.redirect("/books")
    else
        res.render("home")
})

// check if the user is logged in, then show his books
router.get("/books", UserController.checkIfAuthenticated, BookController.showBookList)

// show the add book form
router.get("/addbookform", UserController.checkIfAuthenticated, (req, res) => {
    res.render("addbookform")
})

// this route accepts the entry form
router.post("/books",
    Validator.validateLogin,
    UserController.doLogin,
    UserController.checkIfAuthenticated,
    BookController.showBookList)

// accept the new book submission form
router.post("/doaddbook",
    UserController.checkIfAuthenticated, //check if the user is logged in
    Validator.validateNewBook,
    BookController.addBook,
    BookController.showBookList)

// delete a book with title "title" from the user's list
router.get("/delete/:title",
    UserController.checkIfAuthenticated, //check if the user is logged in
    BookController.deleteBook,
    BookController.showBookList);

// logout
router.get("/logout", UserController.doLogout, (req, res) => {
    res.redirect("/")
})

// show the registration form
router.get("/register", (req, res) => {
    res.render("registrationform")
})

// register the user
router.post("/doregister",
    Validator.validateNewUser,
    UserController.doRegister)

// show the add comment form
router.get("/addcommentform", 
    UserController.checkIfAuthenticated, 
    BookController.showBookListComment, 
    (req, res) => {
    res.render("addcommentform")
})

// accept the form for submitting a new comment
router.post("/doaddcomment",
    UserController.checkIfAuthenticated, //check if the user is logged in
    Validator.validateNewComment,
    BookController.addComment)

export { router }