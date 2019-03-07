const router = require('express').Router();
const jwt = require('jsonwebtoken');
const checkJWT = require('../middlewares/check-jwt');

const User = require('../models/user');
const Order = require('../models/order');
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
            if (!validPassword) {
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
    });
});


router.route('/profile')
    .get(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'An Error Occured. Please try again later'
                });
            } else {
                res.json({
                    success: true,
                    message: 'Successfully authenticated your token',
                    user: user
                });
            }
        })
    })
    .post(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            if (err) {
                return next(err);
            }
            if (req.body.name) {
                user.name = req.body.name
            }
            if (req.body.email) {
                user.email = req.body.email
            }
            if (req.body.password) {
                user.password = req.body.password
            }
            user.isSeller = req.body.isSeller;

            user.save();
            res.json({
                success: true,
                message: 'Profile successfully updated'
            });
        });
    });

router.route('/address')
    .get(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'An Error Occured. Please try again later'
                });
            } else {
                res.json({
                    success: true,
                    message: 'Successfully authenticated your token',
                    address: user.address
                });
            }
        })
    })
    .post(checkJWT, (req, res, next) => {
        User.findOne({ _id: req.decoded.user._id }, (err, user) => {
            if (err) {
                return next(err);
            }
            if (req.body.address1) {
                user.address.address1 = req.body.address1
            }
            if (req.body.address2) {
                user.address.address2 = req.body.address2
            }
            if (req.body.city) {
                user.address.city = req.body.city
            }
            if (req.body.postalCode) {
                user.address.postalCode = req.body.postalCode
            }
            if (req.body.state) {
                user.address.state = req.body.state
            }
            if (req.body.country) {
                user.address.country = req.body.country
            }

            user.save();
            res.json({
                success: true,
                message: 'Profile\'s Address successfully updated'
            });
        });
    });

router.get('/orders', checkJWT, (req, res, next) => {
    Order.find({ owner: req.decoded.user._id })
        .populate('products.product')
        .populate('owner')
        .exec((err, orders) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Couldn\'t find your order'
                });
            } else {
                res.json({
                    success: true,
                    message: 'found your order',
                    orders: orders
                });
            }
        });
});

router.get('/orders/:id', checkJWT, (req, res, next) => {
    Order.findOne({ _id: req.params.id })
        .deepPopulate('products.product.owner')
        .populate('owner')
        .exec((err, orders) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Couldn\'t find your order'
                });
            } else {
                res.json({
                    success: true,
                    message: 'found your order',
                    orders: orders
                });
            }
        });
});


module.exports = router;