
const { reviewValidationSchema, filmValidationSchema } = require('./schemas.js');
const AppError = require('./utils/AppError');
const Film = require('./models/film');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Por favor, inicia sesión');
        return res.redirect('/users/login');
    } 
    next()
};

module.exports.validateFilm = (req, res, next) => { // import JOI validation schema from schemas.js and create a fn to validate
    const { error } = filmValidationSchema.validate(req.body);
    if(error){
        const msg = error.message;
        console.log(req.body);
        throw new AppError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async(req, res, next) =>{
    const { id } = req.params;
    const film = await Film.findById(id);
    if (!film.author.equals(req.user._id)){
        req.flash('error', 'No tienes autorización para realizar la acción deseada')
        return res.redirect(`/films/${id}`);
    }
    next()
};

module.exports.isReviewAuthor = async(req, res, next) =>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'No tienes autorización para realizar la acción deseada')
        return res.redirect(`/films/${id}`);
    }
    next()
};
// // import JOI validation schema from schemas.js and create a fn to validate
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if(error){
        const msg = error.message;
        throw new AppError(msg, 400);
    } else {
        next();
    }
};