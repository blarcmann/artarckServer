const router = require('express').Router();
const async = require('async');
const Category = require('../models/category');
const Product = require('../models/product');


router.get('/products', (req, res, next) => {
    let page = req.query.page;
    let perPage = 12;
    async.parallel([
        function (callback) {
            Product.countDocuments({}, (err, count) => {
                let totalProducts = count;
                callback(err, totalProducts);
            });
        },
        function (callback) {
            Product.find({})
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .populate('owner')
                .exec((err, products) => {
                    if (err) {
                        return next(err)
                    }
                    callback(err, products)
                })
        },
    ], function (err, results) {
        let totalProducts = results[0];
        let products = results[1];
        res.json({
            success: true,
            message: 'Successfully returned products',
            products: products,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });
    });
});

router.route('/categories')
    .post((req, res, next) => {
        let category = new Category();
        category.name = req.body.category;
        category.save()
        res.json({
            success: true,
            message: `Successfully created yr category ${category.name}`
        });
    })
    .get((req, res, next) => {
        Category.find({}, (err, categories) => {
            if (categories) {
                res.json({
                    success: true,
                    message: 'All categories returned',
                    categories: categories
                });
            }
            if (err) {
                res.json({
                    success: false,
                    message: 'failed to return categories'
                })
            }
        });
    });


router.get('/categories/:id', (req, res, next) => {
    let page = req.query.page;
    let perPage = 12;
    async.parallel([
        function (callback) {
            Product.countDocuments({ category: req.params.id }, (err, count) => {
                let totalProducts = count;
                callback(err, totalProducts);
            });
        },
        function (callback) {
            Product.find({ category: req.params.id })
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .populate('owner')
                .exec((err, products) => {
                    if (err) return next(err);
                
                    callback(err, products)
                })
        },
        function (callback) {
            Category.find({ _id: req.params.id }, (err, category) => {
                callback(err, category)
            });
        }
    ], function (err, results) {
        let totalProducts = results[0];
        let products = results[1];
        let category = results[2];
        res.json({
            success: true,
            message: 'Successfully returned products',
            products: products,
            categoryName: category.name,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });
    });
});


router.get('/product/:id', (req, res, next) => {
    Product.findById({_id: req.params.id})
    .populate('category')
    .populate('owner')
    .exec((err, product) => {
        if(err) {
            res.json({
                success: false,
                message: 'Product not found'
            });
        } else {
            res.json({
                success: true,
                message: 'Heres the product details',
                product: product,
            });
        }
    });
});

module.exports = router;