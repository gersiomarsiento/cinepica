const { string } = require('joi');
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.filmValidationSchema = Joi.object({
    film: Joi.object({
        title: Joi.string().required().escapeHTML(),
        alternateName: Joi.array(),
        genres: Joi.required(),
        country: Joi.array().required(),
        runtime: Joi.string().required().escapeHTML(), 
        year: Joi.number().required(),
        director: Joi.array().required(),
        actores: Joi.array(),
        image1: Joi.string().allow('').escapeHTML(),
        // image2: Joi.string().allow('').escapeHTML(),
        imagesGallery: Joi.array().allow(''),
        description: Joi.string().required().escapeHTML(), 
        link: Joi.string().allow('').escapeHTML(),
        imdb: Joi.string().allow('').escapeHTML(), 
        filmPath: Joi.string().allow('').escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewValidationSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(10),
        title: Joi.string().required().escapeHTML(),
        creationDate: Joi.string().escapeHTML(),
        body: Joi.string().required().escapeHTML()
    }).required()
})