const express = require('express')
const public_route = express.Router()
const auth_controller = require('../controllers/auth.controller.js')

public_route.get("/",(req,res)=>{
    res.send("API is ready")
})

public_route.post("/api/login",auth_controller.login_user)
public_route.post("/api/register",auth_controller.register_user)

module.exports = public_route