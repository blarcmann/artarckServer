const router = require('express').Router();
const Product = require('../models/product');
const config = require('../config');
const devConfig = config.development;
const checkJWT = require('../middlewares/check-jwt');
const faker = require('faker');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
// let s3 = new aws.S3();

var s3 = new aws.S3({
    accessKeyId: devConfig.awsuserKeyID,
    secretAccessKey: devConfig.awsuserSecretAccesskey,
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'artarck',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        },
    })
});


router.route('/products')
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.body.location;
        product.save();
        res.json({
            success: true,
            message: 'Successfully Added the product'
        });

    })
    .get(checkJWT, (req, res, next) => {
        Product.find({ owner: req.decoded.user._id })
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if (products) {
                    res.json({
                        success: true,
                        message: 'Users products loaded',
                        products: products
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'Err returning your products....please retry'
                    })
                }
            })
    });

// Faker for data pop
router.get('/faker/test', (req, res, next) => {
    for (let i = 0; i < 33; i++) {
        let product = new Product();
        product.owner = '5c4aef8431d0682b4727eb29';
        product.category = '5c4e36cb68787d1fe3ed5e68';
        product.image = faker.image.abstract();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.paragraph();
        product.price = faker.commerce.price();
        product.save();
    }
    res.json({
        message: 'Successfully added dummy products'
    })
})

module.exports = router;