const {logEvents} = require('./logEvents');

const errorHandler = function(err, req, res, next){
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack);
    res.status(500).send('Not Allowed by CORS');
}

module.exports = errorHandler;