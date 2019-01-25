const jwt = require('jsonwebtoken');
const configuration = require('../config');

let config = configuration.development;

module.exports = (req, res, next) => {
    let token = req.headers['authorization'];
    if(token) {
        jwt.verify(token, config.key, (err, decoded) => {
            if(err) {
                res.json({
                    success: false,
                    message: 'Failed to Authenticate token'
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).json({
            success: false,
            message: 'Token not provided'
        });
    }
}

// o.c cousant connect
// android && ionic 
// dropped cos of on-site fully
//2-3 days onsite preffered ()
