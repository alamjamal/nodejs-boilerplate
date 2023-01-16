const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () => (config.env === 'production'  && 'development'? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;


const rfs = require("rotating-file-stream");
const rfsStreamLog = rfs.createStream("access.log", {
    // size: '10M', // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    // compress: 'gzip', // compress rotated files
    path: config.logDirectory

 })


const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: rfsStreamLog ,
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream:  rfsStreamLog ,
});


module.exports = {
  successHandler,
  errorHandler,
};
