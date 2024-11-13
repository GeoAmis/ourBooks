import * as BookList from '../model/booklist_model.mjs' // version 3 with ORM sequelize, postgress

const doLogin = async (req, res, next) => {
    // vallidity check OK
    try {
        const user = await BookList.login(req.body.username, req.body.password)
        if (user) {
            req.session.username = req.body.username // username is entered as a session variable
            res.locals.username = req.session.username // res.locals variables are directly accessible in the template
            next() // the next middleware is showBooklist
        }
        else {
            res.render("home", { newusermessage: "Λάθος όνομα χρήστη ή συνθηματικό" })
        }
    } catch (error) {
        res.render("home", { newusermessage: error.message });
    }
}

// register new user
const doRegister = async (req, res, next) => {

    // grab username and password from the request body
    const username = req.body.username
    const password = req.body.password

    try {
        const user = await BookList.addUser(username, password)
        if (user) {
            res.render("home", { newusermessage: "Η εγγραφή του χρήστη έγινε με επιτυχία`" })
        }
        else {
            throw new Error("άγνωστο σφάλμα κατά την εγγραφή του χρήστη")
        }
    } catch (error) {
        next(error)
    }
}

// logout handling
const doLogout = (req, res, next) => {
    req.session.destroy() // destroy the session in the session store
    next()
}

function checkIfAuthenticated(req, res, next) {
    if (req.session.username) { // if the variable is set in the session store, we consider that the user is logged in
        res.locals.username = req.session.username
        next() // next middleware
    }
    else
        res.redirect("/") // otherwise redirect to home page
}

export { checkIfAuthenticated, doLogin, doRegister, doLogout }