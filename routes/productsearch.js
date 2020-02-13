const router = require('express').Router();
const Product = require('../models/product');


router.get('/q?', (req, res, next) => {
    if (req.query.queryParam != 'undefined') {
        Product.find({ $text: { $search: req.query.queryParam } })
            .populate('owner')
            .deepPopulate('owner.name')
            .exec((error, results) => {
                if (error) {
                    res.json({
                        success: false,
                        message: ''
                    })
                }
                if (results && results.length) {
                    res.json({
                        success: true,
                        message: 'search data successfully',
                        searchData: results
                    })
                }
            })
    }
})


module.exports = router;