const router = require('express').Router();
const Product = require('../models/product');
const config = require('../config');
const devConfig = config.development;
const checkJWT = require('../middlewares/check-jwt');

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
    .get()


module.exports = router;