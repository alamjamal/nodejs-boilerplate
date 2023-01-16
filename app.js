const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const createError = require('http-errors')
const config = require('./_helper/config');
const morgan = require('./_helper/morgan');
const { authLimiter } = require('./middleware/rateLimiter');
const {  errorHandler } = require('./middleware/error-handler');

const bodyParser = require('body-parser');



const app = express();

// if (config.env !== 'test') {
//   app.use(morgan.successHandler);
//   app.use(morgan.errorHandler);
// }


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({ limit: "20mb" ,  extended: true, parameterLimit: 1000 }))


// set security HTTP headers
app.use(helmet());


// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//     app.use('/user/auth', authLimiter);
// }

app.use('/agency', require('./route/agency.route'))



app.use((req, res, next) => {
  next(createError.NotFound())
})
  

  // handle error
app.use(errorHandler);
  
  module.exports = app;

  


