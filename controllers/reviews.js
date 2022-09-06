const Film = require('../models/film');
const Review = require('../models/review');

//AGREGAR ALGO PARA STOREAR LA INFO DEL COMMENT CUANDO NO SE ESTA LOGEADO Y REDIRECTS AL LOGIN
module.exports.createReview = async(req, res, next)=>{
    const film = await Film.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    review.creationDate = new Date().toJSON().slice(0, 10);;
    film.reviews.push(review);
    await review.save();
    await film.save();
    req.flash('success', '¡Reseña ingresada!');
    res.redirect(`/films/${film._id}`)
}
module.exports.deleteReview = async(req, res, next)=>{
    const { id, reviewId } = req.params;
    await Film.findByIdAndUpdate(id, { $pull: { reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '¡Reseña eliminada!');
    res.redirect(`/films/${id}`)
}