const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BookSchema = new Schema({
    bookName: String,
    bookAuthor: String,
    bookISBN: Number,
    bookPrice: Number
});

module.exports = mongoose.model('Book', BookSchema);