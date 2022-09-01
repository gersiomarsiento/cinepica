const User = require('../models/user');

module.exports.renderRegisterForm = (req, res)=>{
    res.render('users/register')
}
module.exports.registerUser = async (req, res)=>{
    try{
        const { email, username, password } = req.body;
        const user = new User({ email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next();
            req.flash('success', `Usuario creado correctamente. ¡Bienvenido/a, ${user.username}!`);
            res.redirect('/films')
        })
    } catch (e) {
        req.flash('error', '¡El usuario y/o email ya existe!')
        res.redirect('register')
    }
}
module.exports.renderLoginForm = (req, res)=>{
    res.render('users/login')
}
module.exports.passportLogin = (req, res) => {
    req.flash('success', `¡Hola, ${req.body.username}!`);
    const redirectUrl = req.session.returnTo || '/films';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.logoutUser = (req, res) => {
    req.logout(()=>{    
        req.flash('success', 'Tu sesión ha sido cerrada');
        res.redirect('/films')
    });
}