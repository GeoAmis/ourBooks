import * as BookList from '../model/booklist_model.mjs' // version 3 with ORM sequelize, postgress
import { Book, User, BookUser } from '../model/booklist_seq_pg.mjs';

// show the booklist of the user
async function showBookList(req, res, next) {
    try {
        const myBooks = await BookList.loadBooks(req.session.username)
        res.render("booklist", { books: myBooks })
    } catch (error) {
        next(error)
    }
}

// show the tittle, author, comments, mycomment
async function showBookListComment(req, res, next) {
    try {
        const book = await BookList.loadComments(req.query.bookTitle)
        const username = req.session.username;
        
        // separate the comments to user one and other users
        const userComment = book.comments.find(comment => comment.user === username);
        const otherUsersComments = book.comments.filter(comment => comment.user !== username);

        // render with book and comments data
        res.render("addcommentform", {
            title: book.title,
            author: book.author,
            comments: otherUsersComments,
            mycomment: userComment ? userComment.comment : ""
        })
    } catch (error) {
        next(error)
    }
}

// add book
const addBook = async (req, res, next) => {
    try {
        await BookList.addBook({
            "title": req.body["newBookTitle"],
            "author": req.body["newBookAuthor"]
        }, req.session.username)
        next() // next middleware is showBookList
    }
    catch (error) {
        next(error) // if an error occurred, next(error) will call the middleware with the parameters (error, req, res, next)
    }
}

// delete book
const deleteBook = async (req, res, next) => {
    const title = req.params.title;
    try {
        await BookList.deleteBook({ title }, req.session.username)
        next() //next middleware is BookController.showBookList
    }
    catch (error) {
        next(error)//if an error occurred, next(error) will call the middleware with the parameters (error, req, res, next)
    }
}

// add comment
const addComment = async (req, res) => {
    try {
        // grab the values of bookTitle from the querry, the comment from the body and the username from the session
        const bookTitle = req.query.bookTitle
        const comment = req.body.newBookComment
        const username = req.session.username

        // check if theres a user
        const user = await User.findOne({ where: { name: username } })
        if (!user) throw new Error("User not found")

        // check if there's a book
        const book = await Book.findOne({ where: { title: bookTitle } })
        if (!book) throw new Error("Book not found")

        //insert a new record if it doesn't exist, or update an existing one to the BookUser
        await BookUser.upsert({
            BookTitle: book.title,
            UserName: user.name,
            comment: comment
        })
        // redirect to the /books page
        res.redirect("/books")
    } catch (error) {
        next(error);
    }
}

export { showBookList, addBook, deleteBook, addComment, showBookListComment }