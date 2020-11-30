// For the routes
let express = require('express');
let router = express.Router();
// For the Data Model
let BookSchema = require('../models/books');


function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.post('/api/books', (request, response, next) => {
    let newBook = request.body;
    if (!newBook.bookName || !newBook.bookAuthor || !newBook.bookISBN || !newBook.bookPrice){
        HandleError(response, 'Missing Info', 'Form data missing', 500);
    } else{
        let book = new BookSchema({
            bookName: newBook.bookName,
            bookAuthor: newBook.bookAuthor,
            bookISBN: newBook.bookISBN,
            bookPrice: newBook.bookPrice

        });
        book.save((error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send({"id": book.id});
            }
        });
    }
});

router.get('/api/books', (request, response, next) => {
    BookSchema
        .find()
        .exec( (error, books) => {
            if (error){
                response.send( {"error": error});
            } else{
                response.send(books);
            }
        });
});

router.get('/api/books/?author=name', (request, response, next) => {
    let name = request.query['name'];
    if (name) {
        BookSchema
            .find({"bookAuthor": name})
            .exec((error, books) => {
                if (error) {
                    response.send({"error": error});
                } else {
                    response.send(books);
                }
            });
    } else {
        BookSchema
            .find()
            .exec((error, books) => {
                if (error) {
                    response.send({"error": error});
                } else {
                    response.send(books);
                }
            });
    }
});


router.get('/api/books/:isbn', (request, response, next) => {
    BookSchema
        .findOne({"isbn": request.params.isbn}, (error, result) => {
            if (error) {
                response.status(500).send(error);
            }
            if (result) {
                response.send(result);
            } else {
                response.status(404).send({"id": request.params.id, "error": "Not Found"});
            }

        });
});

router.patch('/api/books/:isbn', (request, response, next) => {
    BookSchema
        .findOne(request.params.isbn, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body.isbn){
                    delete request.body.isbn;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, book)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(book);
                });
            }else{
                response.status(404).send({"isbn": request.params.isbn, "error":  "Not Found"});
            }
        });
});

router.delete('/api/books/:isbn', (request, response, next) => {
    BookSchema
        .findOne(request.params.isbn, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deletedISBN": request.params.isbn});
                });
            }else{
                response.status(404).send({"isbn": request.params.isbn, "error":  "Not Found"});
            }
        });
});

module.exports = router;