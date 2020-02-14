const router = require('express').Router();
const Product = require('../models/product');
const config = require('../config');
const cloudinary = require('cloudinary').v2;
const devConfig = config.development;
const checkJWT = require('../middlewares/check-jwt');
const faker = require('faker');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

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

router.post('/create_product', checkJWT, (req, res) => {
    if (req.files.product_picture) {
        const file = req.files.product_picture;
        cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
            if (err) {
                console.log('error occured while uploading', err);
                return res.status(501).json({
                    success: false,
                    message: 'error occured while uploading to cloudinary'
                })
            }
            let img_url = result.url;
            let product = new Product({
                owner: req.decoded.user._id,
                category: req.body.categoryId,
                description: req.body.description,
                title: req.body.title,
                price: req.body.price,
                image: img_url
            });
            product.save();
            return res.status(201).json({
                success: true,
                message: 'Successfully added the product',
            });
        })
    } else {
        let product = new Product({
            owner: req.decoded.user._id,
            category: req.body.categoryId,
            description: req.body.description,
            title: req.body.title,
            price: req.body.price,
            image: ''
        });
        product.save();
        return res.status(201).json({
            success: true,
            message: 'Successfully added the product',
        });
    }
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
            message: 'Successfully qdded the product'
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
router.get('/faker', () => {
    for (let i = 0; i < 5; i++) {
        let product = new Product();
        product.owner = '5e45d057a211cb0004582477';
        product.category = '5c5df72290c0eb4cdf5f1ecf';
        product.image = faker.image.animals();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.paragraph();
        product.price = faker.commerce.price();
        product.save();
    }
})

module.exports = router;