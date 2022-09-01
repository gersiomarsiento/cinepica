const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    }
})

let options = {
    errorMessages: {
        UserExistsError: '¡El usuario y/o email ya existen!',
        IncorrectUsernameError: 'Credenciales incorrectas',
        IncorrectPasswordError: 'Credenciales incorrectas'
    }
};

UserSchema.plugin(passportLocalMongoose, options);

const User = mongoose.model('User', UserSchema);
module.exports = User;