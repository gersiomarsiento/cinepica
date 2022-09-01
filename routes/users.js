const express = require('express');
const router = express.Router();
const users = require('../controllers/users')
const passport = require('passport');
const catchAsyncError = require('../utils/catchAsyncError');


router.route('/register')
    .get(users.renderRegisterForm) //Register form
    .post(catchAsyncError(users.registerUser)); // post registration req

router.route('/login')
    .get(users.renderLoginForm) //Login form
    .post(passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/users/login',
    keepSessionInfo: true
}), users.passportLogin); 

router.get('/logout', users.logoutUser) //Log user out 

module.exports = router;