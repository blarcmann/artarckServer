const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config');


router.post('/signup', (req, res, next) => {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.picture = user.gravatar();
    user.isSeller = req.body.isSeller;

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (existingUser) {
            res.json({
                success: false,
                message: 'An existing account already has this email'
            })
        } else {
            user.save();
            let token = jwt.sign({
                user: user
            }, config.development.key, {
                expiresIn: '7d'
            });
            res.json({
                success: true,
                message: 'Your Account is successfully created',
                token: token
            });
        }
    });
});


router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            res.json({
                success: false,
                message: 'Email not found...Authentication failed'
            });
        } else if (user) {
            let validPassword = user.comparePassword(req.body.password);
            if(!validPassword) {
                res.json({
                    success: false,
                    message: 'Password seems incorrect. Authentication failed!'
                });
            } else {
                var token = jwt.sign({
                    user: user
                }, config.development.key, {
                    expiresIn: '7d'
                });
                res.json({
                    success: true,
                    message: 'Sucessfully logged in. redirecting...',
                    token: token
                })
            }
        }
    })
})

module.exports = router;