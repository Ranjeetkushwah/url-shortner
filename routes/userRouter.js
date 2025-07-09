const express = require('express')
const router = express.Router()
const {handleUserSignup,handleUserlogin}=require('../controllers/userCont')

//signup
router.post("/",handleUserSignup)

//login
router.post('/login',handleUserlogin)

module.exports= router