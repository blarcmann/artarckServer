const router = require('express').Router();
const Category = require('../models/category');


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
    })

module.exports = router;