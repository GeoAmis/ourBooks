# ourBooks
___
ourBooks app is a simple book management app.

## Comments based on the changes made to resolve the final assignment
___
### 1. Create a page for submitting and viewing existing comments.

> I added to the views folder the file **addcommentform.hbs** which based on the specific book title shows you the author and title and prompts you to add a comment on that book. Also, on the lower part checks if the said book has anyone commented on it and provides their usernames and comments. If there's no comment about that book, a specified message appears. 

### 2. Modification to **booklist.hbs** file in order to send the user to a specified comment page.

> Οn the booklist.hbs file i added an additional "Σχόλιο" button on each line of books, which directs us to the path **/doaddcomment?bookTitle={{title}}** where the title field will contain the title of each book.

### 3. Μodification to routes.mjs file to support routing on the addcommentform page.

> added two routes to routes.mjs file:
```
// show the add comment form
    router.get("/addcommentform", 
    UserController.checkIfAuthenticated, 
    BookController.showBookListComment, 
    (req, res) => {
    res.render("addcommentform")
    })

// accept the form for submitting a new comment
    router.post("/doaddcomment",
    //check if the user is logged in
    UserController.checkIfAuthenticated,
    Validator.validateNewComment,
    BookController.addComment)
```
> In the first one, we get redirected when the user presses the button **"Σχόλιο"** on a book of his book list. In this case, we check if this user is authenticated and then show the **addcommentform.hbs** form page.

> In the second one, we get redirected when the user submits his comment to the **addcommentform.hbs** form page. In this case we check if the user is authenticated, we validate his comment and then we add/update his comment.

### 4. Modification of the **booklist_model.mjs** file with the addition of the comment function.

> In the **booklist_model.mjs**  a function has been added:

+ **loadComments:** This function searches a book from the Book model where the title=bookTitle and grabs its title and author from the table. Then checks if there's a book with the specified title and if there's one, searches on the BookUser model all usernames and their corresponding comments that have been submitted for that book title. Finaly, it returns the title, author and an object with usernames and their comments for that specific title.

### 5. Modification of the **booklist_controller.mjs** file with the addition of the call function of the corresponding model function to insert the comments into the database.

> In the **booklist_controller.mjs**  two functions have been added:
1. **showBookListComment:** In this function we grab the comments from the loadComments with the help of the query and also the username from the session. Then we separate the user comment from the others comments. Lastly we render the addcommentform with the title, author, comments and user's comment.

1. **addComment:** Through this we grab the bookTitle from the query, the comment through the body and the username from the session. Then we check if there's a user and a book based on what we have and if something is missing we produce an error message. Then we insert a new record if there's no comment from the user, or update the existing one to the BookUser. Lastly, we get redirected to the "/books".

### 6. Posting the application to the public Render hosting platform.

> The application has been published on __[Render](https://render.com)__ via the following link __[ourBooks@Render](https://ourbooks-825m.onrender.com)__. The current database will expire on December 11, 2024.
