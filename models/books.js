const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BookSchema = new Schema({
    bookName: String,
    bookAuthor: String,
    bookISBN: String,
    bookPrice: Number
});

module.exports = mongoose.model('Book', BookSchema);