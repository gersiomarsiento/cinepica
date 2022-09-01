//Requirements
const mongoose = require('mongoose');
const films = require('./films.js');
const Film = require('../models/film.js');
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//Connect to mongoose
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/cinepica-app'
mongoose.connect(dbUrl)

//Connect to Database, log if error 
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Database Connected!');
})

//Seed the DB from the films.js file
const seedDB = async ()=>{
    //Clear out the DB
    await Film.deleteMany({});
    //Loop over films
    for (film of films){
        const f = new Film({
            title: film.name, 
            year: film.year,
            description: film.description,
            alternateName:  film.alternateName,
            genres: film.genres,
            country:  film.country,
            runtime:  film.runtime,
            director:  film.director,
            actores:  film.actores,
            image1:  film.image1,
            imagesGallery: film.imagesGallery,
            link:  film.link,
            imdb: film.imdb, 
            filmPath: film.filmPath,
            author: "631130921e364db7489507db" //Author gersiomarsiento
        });
        await f.save();    
    }
}

//Run the seed function, then close after done
seedDB().then(()=>{
    console.log('Database Seeded!');
    mongoose.connection.close()
});