const router = require('express').Router();
const Product = require('../models/product');
// const Category = require('../models/category');
// const algoliasearch = require('algoliasearch');
// const client = algoliasearch('M4HRMABA2K', '179c84f716ec086ae21c9ee084a5d2fd');
// const index = client.initIndex('artarckrc');


// router.get('/', (req, res, next) => {
//     if (req.query.query) {
//         index.search({
//             query: req.query.query,
//             page: req.query.page,
//         }, (err, content) => {
//             res.json({
//                 success: true,
//                 message: 'Search completed',
//                 status: 200,
//                 content: content,
//                 search_result: req.query.query
//             });
//         });
//     }
// });


router.get('/q?', (req, res, next) => {
    if (req.query.queryParam != 'undefined') {
        Product.find({ $text: { $search: req.query.queryParam } })
        // Product.find({ $text: { $search: new RegExp(`^${req.query.queryParam}$`) } })
            // .skip(12)
            // .limit(12)
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