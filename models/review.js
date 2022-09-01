const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    creationDate: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: User
    }
})

module.exports = mongoose.model('Review', reviewSchema)