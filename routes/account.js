const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');


router.post('/signup', (req, res, next) => {
    console.log(req.body)
})