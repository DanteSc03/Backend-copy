const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) =>{
    const origin = req.headers.origin;
    console.log(`Request from: ${origin}`);
    if(allowedOrigins.includes(origin)){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    next();
}

module.exports = credentials;