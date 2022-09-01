const express = require('express');
const router = express.Router( {mergeParams: true} );
const reviews = require('../controllers/reviews')
const catchAsyncError = require('../utils/catchAsyncError');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');

//AGREGAR ALGO PARA STOREAR LA INFO DEL COMMENT CUANDO NO SE ESTA LOGEADO Y REDIRECTS AL LOGIN
router.post('/', isLoggedIn, validateReview, catchAsyncError(reviews.createReview)) //Post a review on a film

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsyncError(reviews.deleteReview)) //Delete a review

module.exports = router