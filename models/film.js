const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImagesGallerySchema = new Schema ({
  url: String,
  filename: String
})

ImagesGallerySchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload/','/upload/w_200/')
})

const FilmSchema = new Schema({
    title: {
    type: String,
    required: true,
  },
  alternateName: {
    type: [String],
  },
  genres: {
    type: [String],
    required: true,
    enum: {
        values: [
            "comedia",
            "drama",
            "suspenso",
            "terror",
            "accion",
            "psicologica",
            "policial",
            "romantica",
            "musical",
            "documental",
            "biografica",
            "animada",
            "fantasia",
            "thriller",
            "historica",
            "sci-fi",
            "musica",
        ],
        message:'{VALUE} is not supported'}
  },
  country: {
    type: [String],
    required: true,
  },
  runtime: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1800,
    max: 2100,
  },
  director: {
    type: [String],
    required: true,
  },
  actores: {
    type: [String],
  },
  image1: {
    type: String, 
    required: true
},
  imagesGallery: [ImagesGallerySchema],
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  imdb: {
    type: String,
  },
  filmPath: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User' 
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

FilmSchema.virtual('coverThumbnail').get(function () {
  return this.image1.replace('/upload/','/upload/w_100/')
})

FilmSchema.post('findOneAndDelete', async function (doc) {
  if(doc){
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

const Film = mongoose.model("Film", FilmSchema);
module.exports = Film;
