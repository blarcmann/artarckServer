const router = require('express').Router();
const Product = require('../models/product');
const config = require('../config');
const devConfig = config.development;

const aws = require('aws-sdk');
const multer = require('multer');
const multers3 = require('multer-s3');

const s3 = new aws.S3({
    accessKeyId: devConfig.awsuserKeyID,
    secretAccessKey: devConfig.awsuserSecretAccesskey
});

const upload = multer({
    storage: multers3({
        s3: s3,
        bucket: 'artarck',
        metadata: function(req, file, cb) {
            cb(null, {fieldName: file.fieldName});
        },
        key: function (req, file, cb) {
            cb(null, { fieldName: file.fieldName });
        },
    })
});


module.exports = router;