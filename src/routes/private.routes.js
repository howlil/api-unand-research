const express = require('express')
const api = express.Router()
const {uploadImage} = require('../middlewares/upload_image.middleware.js')
const {uploadPDF} = require('../middlewares/upload_file.middleware.js')
const {authenticate} = require("../middlewares/auth.middleware.js")
const auth_controller = require("../controllers/auth.controller.js")

api.use(authenticate)

// auth
api.get("/api/me",auth_controller.get_users)
api.patch("/api/me",uploadImage, auth_controller.edit_user)


module.exports = api
