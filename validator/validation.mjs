import { body, validationResult } from 'express-validator'
import validator from 'validator'

// validate the login
const validateLogin = [
    body("username")
        .trim().escape().isLength({ min: 4 })
        .withMessage("Δώστε όνομα με τουλάχιστον 4 χαρακτήρες"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("home", { message: errors.mapped() })
        }
    }
]

// validate the new book
const validateNewBook = [
    body("newBookTitle") //validity check for title
        .custom(value => {
            for (let ch of value) {
                if (!validator.isAlpha(ch, 'el-GR') &&
                    !validator.isAlpha(ch, 'en-US') &&
                    !validator.isNumeric(ch, 'en-US') &&
                    ch != ' ') {
                    throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες, καθώς και αριθμοί, μη αποδεκτός χαρακτήρας: "' + ch + '"');
                }
            }
            return true;
        })
        .trim().escape()
        .isLength({ min: 5 })
        .withMessage("Τουλάχιστον 5 γράμματα"),
    body("newBookAuthor") //validity check for author
        .custom(value => {
            for (let ch of value) {
                if (!validator.isAlpha(ch, 'el-GR') &&
                    !validator.isAlpha(ch, 'en-US') &&
                    ch != ' ') {
                    throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες μη αποδεκτός χαρακτήρας: "' + ch + '"');
                }
            }
            return true;
        })
        .trim().escape()
        .isLength({ min: 5 })
        .withMessage("Τουλάχιστον 5 γράμματα"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("addbookform", {
                message: errors.mapped(), // descriptions of validation errors
                title: req.body["newBookTitle"], // value given by the user
                author: req.body["newBookAuthor"] // value given by the user
            })
        }
    }
]

// validate the new user
const validateNewUser = [
    body("username")
    .trim().escape().isLength({ min: 4 })
    .withMessage("Δώστε όνομα με τουλάχιστον 4 χαρακτήρες"),
body("password-confirm")
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage('Το συνθηματικό πρέπει να έχει από 4 μέχρι 10 χαρακτήρες')
    .custom((value, { req }) => {
        if (value != req.body.password)
            throw new Error("Το συνθηματικό πρέπει να είναι το ίδιο και στα δύο πεδία")
        else
            return true
    }), 
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("registrationform", {
                message: errors.mapped()
            })
        }
    }
]

// validate the new comment
const validateNewComment = [
    body("newBookComment")
    .custom(value => {
        for (let ch of value) {
            if (!validator.isAlpha(ch, 'el-GR') &&
                !validator.isAlpha(ch, 'en-US') &&
                !validator.isNumeric(ch, 'en-US') &&
                ch != ' ') {
                throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες, καθώς και αριθμοί, μη αποδεκτός χαρακτήρας: "' + ch + '"');
            }
        }
        return true;
    })
    .trim().escape()
    .isLength({ min: 5 })
    .withMessage("Τουλάχιστον 5 γράμματα"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("addcommentform", {
                message: errors.mapped(), // descriptions of validation errors
                comment: req.body["newBookComment"],
                title: req.body["newBookTitle"], 
                author: req.body["newBookAuthor"] 
            })
        }
    }
]

export { validateLogin, validateNewBook, validateNewUser, validateNewComment }