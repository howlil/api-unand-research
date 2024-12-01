const Joi = require('joi')

module.exports = {
    login_user: {
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    },

    register_user: {
        email: Joi.string().email().required(),
        nama: Joi.string().required(),
        password: Joi.string().min(8).required()
    }
}