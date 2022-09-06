const express = require('express');
const router = express.Router();
const films = require('../controllers/films');
const catchAsyncError = require('../utils/catchAsyncError');
const { isLoggedIn, validateFilm, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

const uploadMany = upload.fields([{name: 'film[image1]', maxCount: 1}, /*ADD IMAGE 2 LATER */ {name: 'film[imagesGallery]', minCount: 4, maxCount: 20}])

router.route('/')
    .get(catchAsyncError(films.index)) //List all films from DB
    .post(isLoggedIn, uploadMany, validateFilm, catchAsyncError(films.createFilm)) //Post new films

router.get('/map', catchAsyncError(films.showMap)); //Show full film map

router.get('/new', isLoggedIn, films.renderNewForm);//New film form <-- Simple error handler bc catchasync bring up "cannot reset headers error"

router.get('/random-film', catchAsyncError(films.showRandomFilm)); //Show a random film
    
router.route('/:id')
    .get(catchAsyncError(films.showFilm)) //Show a film
    .put(isLoggedIn, isAuthor, uploadMany, validateFilm, catchAsyncError(films.updateFilm)) //Post the edited film
    .delete(isLoggedIn, isAuthor, catchAsyncError(films.deleteFilm)); //Delete a film

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyncError(films.renderEditForm)); //Edit a film

module.exports = router