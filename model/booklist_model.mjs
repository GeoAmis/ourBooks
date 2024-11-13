import { Book, User, BookUser } from './booklist_seq_pg.mjs'
import bcrypt from 'bcrypt'

// add user to the "User" table
async function addUser(username, password) {
    try {
        if (!username || !password)
            throw new Error("Λείπει το όνομα ή το συνθηματικό του χρήστη")

        let user = await User.findOne({ where: { name: username } })

        if (user)
            throw new Error("Υπάρχει ήδη χρήστης με όνομα " + username)

        const hash = await bcrypt.hash(password, 10)
        user = await User.create({ name: username, password: hash })
        return user
    } catch (error) {
        throw error
    }
}

// login user function
async function login(username, password) {
    try {
        if (!username || !password)
            throw new Error("Λείπει το όνομα ή το συνθηματικό του χρήστη")

        let user = await User.findOne({ where: { name: username } })

        if (!user)
            throw new Error("Δεν υπάρχει χρήστης με όνομα " + username)

        const match = await bcrypt.compare(password, user.password)
        if (match)
            return user
        else
            throw new Error("Λάθος στοιχεία πρόσβασης")
    } catch (error) {
        throw error
    }
}

// function for loading books
async function loadBooks(username) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } });
        if (!user)
            throw new Error("άγνωστος χρήστης")

        const myBooks = await user.getBooks({ raw: true }); // raw returns the "pure" object (the array) without sequelize information
        return myBooks
    } catch (error) {
        throw error
    }
}

// add book to the "Book" table
async function addBook(newBook, username) {
    try {
        if (!username)
            throw new Error("Πρέπει να δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } });
        if (!user)
            throw new Error("άγνωστος χρήστης")

        // check if there's a book with the specified title, author in the "Book"
        const [book, created] = await Book.findOrCreate({
            where: {
                title: newBook.title,
                author: newBook.author
            }
        })
        // add the book with the given title, author
        await user.addBook(book)
    } catch (error) {
        throw error
    }
}

// delete book from the "BookUser" table
async function deleteBook(book, username) {
    try {
        const user = await findOrAddUser(username)
        const bookToRemove = await Book.findOne( { where: { title: book.title } } )

        // delete the book from the user's booklist
        await user.removeBook(bookToRemove)

        // if there are no other users, we delete the book
        const numberOfUsers = await bookToRemove.countUsers()
        if (numberOfUsers == 0) { 
            Book.destroy( { where: { title: book.title } } ) 
        }
    } catch (error) {
        throw error
    }
}

// find or create user to the "User" table
async function findOrAddUser(username) {
        try {
            // check if there's a user, otherwise create one
            const [user, created] = await User.findOrCreate({ where: { name: username } })
            return user
        } catch (error) {
            throw error
        }
}

// load comments
async function loadComments(bookTitle) {
    try {
        // grab book title and author from the Book table
        const book = await Book.findOne({
            where: { title: bookTitle },
            attributes: ['title', 'author']
        })

        // check if the book exists
        if (!book) throw new Error('Book not found')
        else{
            // grab all comments related to the book from the BookUser table
            const bookComments = await BookUser.findAll({
                where: { BookTitle: bookTitle },
                attributes: ['comment', 'UserName']
            })

            // return the title, author and comments as an array with users and their comments in it
            const result = {
                title: book.title,
                author: book.author,
                comments: bookComments.map(userComment => ({
                    user: userComment.UserName, // user who commented
                    comment: userComment.comment // user's comment
                }))
            }

            return result
        }

    } catch (error) {
        throw error
    }
}

export { addUser, login, loadBooks, addBook, deleteBook, loadComments }