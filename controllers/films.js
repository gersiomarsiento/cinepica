const Film = require('../models/film');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const countryCodes = require('../utils/countryCodes.json');
const { json } = require('body-parser');

// CONSTS to store and use FILMS DATA
const allGenres = ["comedia","drama","suspenso","terror","accion","psicologica","policial","romantica","musical","documental","biografica","animada","fantasia","thriller","historica","sci-fi","musica"] 
const allGenresSpa = ["Comedia","Drama","Suspenso","Terror","Acción","Psicológica","Policial","Romántica","Musical","Documental","Biográfica","Animada","Fantasía","Thriller","Histórica","Sci-Fi","Música"];
const filterCategories = ["director", "year", "actores", "genres", "country", "runtime"]; 
const filterCategoriesSpa = ["Director/a", "Año", "Actor/Actriz", "Género", "País", "Duración"];

module.exports.index = async (req, res, next) => {
    const films = await Film.find({});
    res.render('films/index', { films, filterCategories, filterCategoriesSpa })
}
module.exports.renderNewForm = (req, res)=>{
    res.render('films/new', {allGenres, allGenresSpa})
}
module.exports.createFilm = async (req, res, next)=>{
    const film = new Film(req.body.film);
    film.image1 = req.files['film[image1]'][0].path;
    film.imagesGallery = req.files['film[imagesGallery]'].map(file => ({ url: file.path, filename: file.filename}));
    film.author = req.user._id;
    await film.save();
    console.log(film);
    req.flash('success', 'La película ha sido creada correctamente');
    res.redirect(`/films/${film._id}`);
}
module.exports.showFilm = async (req, res, next)=>{
    const { id } = req.params;
    const film = await Film.findById(id).populate({
        path: "reviews", 
        populate: {
            path: "author"
        }
    }).populate("author");
    if(!film) {
        req.flash('error', 'No se encontró la película');
        return res.redirect('/films')
    }
    res.render('films/show', { film });
}
module.exports.showRandomFilm = async (req, res, next)=>{
    const allFilmsId = await Film.find({}, {_id:1});
    const randomFilm = allFilmsId[Math.floor(Math.random()*allFilmsId.length)];
    res.redirect(`/films/${randomFilm._id}`);
}
module.exports.showMap = async (req, res)=>{
    const films = await Film.find({});

    function Country(name, shortName){ //Create Country model
        this.name = name;
        this.shortName = shortName;
        this.filmsList = [] ;
        this.count = 0
    }
    const countriesWithFilm = Array.from(films.flatMap(film => film.country));
    const filmCountries = [];
    for (let country of countryCodes){ // Loop json file to find matches with the countries that have films
        if(countriesWithFilm.includes(country.name_es) || countriesWithFilm.includes(country.name) || countriesWithFilm.includes(country.code)) {
            filmCountries.push(new Country(country.name_es, country.code));
        }
    }
    for (let film of filmCountries){ //Add +1 on count on each country repetition
        for (let country of countriesWithFilm){
            if(country==film.name||country==film.shortName){
                film.count++;
            }
        }
        let rawData = films.filter(x=> x.country.includes(film.name))
        for (let item of rawData){
        film.filmsList.push({title: item.title, imdb: item.imdb, image1: item.coverThumbnail})
       } //CHECK LATER IF I NEED TO REMOVE OR ADD KEY VALUE PAIRS
    }
    // console.log(filmCountries)
    res.render('films/map', { filmCountries, films })
};
module.exports.renderEditForm = async (req, res, next)=>{
    const { id } = req.params;
    const film = await Film.findById(id);
    if(!film) {
        req.flash('error', 'No se encontró la película');
        return res.redirect('/films')
    }
    res.render('films/edit', { film, allGenres, allGenresSpa })
}
module.exports.updateFilm = async (req, res, next)=>{
    const {id} = req.params;
    const film = await Film.findByIdAndUpdate(id,{...req.body.film});
    // ADD IMAGE 2 LATER?
    if(req.files['film[imagesGallery]']){ //if imgs added, push into array
    newImgs = req.files['film[imagesGallery]'].map(file => ({ url: file.path, filename: file.filename}));
    film.imagesGallery.push(...newImgs);
    await film.save();
    }
    if(req.body.deleteImages){ // Delete selected imgs from cloudinary/film db
        for (let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename)
        };
        await film.updateOne({ $pull: { imagesGallery: { filename: { $in: req.body.deleteImages }}}})
    }
    req.flash('success', 'La película ha sido modificada correctamente');
    res.redirect(`/films/${film._id}`);
}
module.exports.deleteFilm = async (req, res, next)=>{
    const { id } = req.params;
    const film = await Film.findById(id);
    film.imagesGallery.forEach(async img => {
        await cloudinary.uploader.destroy(img.filename) //Destroy all imgs from cloudinary
    });
    await cloudinary.uploader.destroy(film.image1.slice(68, film.image1.length-4)) //WARNING! slice is based on format https://res.cloudinary.com/gersiomarsiento/image/upload/v1661659012/Cinepica/wq9yvyihbosixttforzx.jpg' 
    await film.deleteOne();    
    req.flash('success', 'La película ha sido eliminada correctamente');
    res.redirect('/films')
}
