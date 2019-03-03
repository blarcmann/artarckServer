const router = require('express').Router();
const algoliasearch = require('algoliasearch');
const client = algoliasearch('M4HRMABA2K', '179c84f716ec086ae21c9ee084a5d2fd');
const index = client.initIndex('artarckrc');


router.get('/', (req, res, next) => {
    if(req.query.query) {
        index.search({
            query: req.query.query,
            page: req.query.page,
        }, (err, content) => {
            res.json({
                success: true,
                message: 'Search completed',
                status: 200,
                content: content,
                search_result: req.query.query
            });
        });
    }
});


module.exports = router;