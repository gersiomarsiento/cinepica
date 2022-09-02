if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
//Requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const AppError = require('./utils/AppError');
const methodOverride = require('method-override')
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize')
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// IMPLEMENT ROUTES 
const filmsRoutes = require('./routes/films');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

//DB
const MongoStore = require("connect-mongo")
//Production connection to MongoAtlas DB  VS  Development connection to local db
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/cinepica-app'

mongoose.connect(dbUrl)

const db = mongoose.connection; //Connect to Database, log if error 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Database Connected');
})

const app = express();

app.engine('ejs', ejsMate) //EJS-Mate to use layout boilerplates
app.set('view engine', 'ejs'); //Set up paths and views
app.set('views', path.join(__dirname, 'views'));

//*********MIDDLEWARE*********:

app.use(express.urlencoded({ extended:true })); //urlencoded extended true to enable calling req.body and parsing it
app.use(methodOverride('_method')) //MethodOverride -- Middleware that allows the usage of PUT and DELETE override for POST requests (update)
app.use(express.static(path.join(__dirname, 'public'))); //Define PUBLIC folder 
app.use(morgan('tiny')); //Morgan: displays info on each request
app.use(mongoSanitize()); //Sanitize: prohibits the use of strange chars such as $ or . while querying

const secret = process.env.SECRET || 'notagoodsecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on("error", function(e) {
    console.log("Session Store error", e)
})
//Session
const sessionConfig = { 
    store,
    name: "session",
    secret,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 *60 * 24 * 7,
        maxAge: 1000 * 60 *60 * 24 * 7
     }
}

app.use(session(sessionConfig));
app.use(flash());
// Helmet security - 11 protective middleware (beware! it forbids usage o resources (fonts, icons, images, scripts, etc) from not whitelisted sites)
app.use(helmet({contentSecurityPolicy: true, crossOriginEmbedderPolicy: false}));

//Helmet config and whitelisting
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://*.gstatic.com",
    "https://fonts.googleapis.com",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.iconify.design/",
    "https://*.media-imdb.com"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://*.gstatic.com",
    "https://fonts.googleapis.com",
    "https://*.media-imdb.com"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://*.media-imdb.com",
    "https://*.api.unisvg.com",
    "https://*.api.iconify.com",
    "https://*.api.simplesvg.com",
    "https://ka-f.fontawesome.com",

];
const fontSrcUrls = [
    "https://*.gstatic.com",
    "https://ka-f.fontawesome.com",

];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://*.cloudinary.com/gersiomarsiento/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://*.unsplash.com",
                "https://*.media-imdb.com" 
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!['/users/login', '/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

//Import Routes to render
app.use('/films', filmsRoutes);
app.use('/films/:id/reviews', reviewsRoutes);
app.use('/users', usersRoutes);     


// ***** ROUTES *****
app.get('/', (req, res)=> {
    res.render('home')
});

//About page
app.get('/about', (req, res)=>{
    res.render('about')
});

//Contact page
app.get('/contact', (req, res)=>{
    res.render('contact')
});


app.all('*', (req, res, next)=>{
    next(new AppError('Page not found', 404))
})
 
//Return 404 in case no path matches queried page
app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err;
    if(!err.message) message = 'Algo salió mal';
    res.status(statusCode).render('error', { err });
});

//Set server
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`Serving on port ${port}`)
});

