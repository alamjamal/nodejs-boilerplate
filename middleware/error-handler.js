const mongoose = require('mongoose');
const config = require('../_helper/config');
const logger = require('../_helper/logger')

const errorHandler = (err, req, res, next) =>{
    if (config.env==="production"){
        res.locals.errorMessage = err.message;

        if (typeof (err) === 'string') {
            return res.status(400).json({ message:"Custom Application String Error"});
        }
    
        else if (err instanceof mongoose.Error){
            return res.status(400).json({ message:"Database Error"});

        }
    
        else if (err.name === 'ValidationError') {
            // mongoose validation error
            return res.status(400).json({ message:"Database ValidationError"});
        }
    
        else if (err.name === 'UnauthorizedError') {
            // jwt authentication error
            return res.status(401).json({message: 'Token UnauthorizedError' });
        }
        else {
        return res.status(500).json({ code:  500, message: "Internal Server Error"})
        }

    }

    else if(config.env==="development"){
        res.locals.errorMessage = err.message;
        res.status(err.status || 500)
        // logger.error(err.stack);
        return res.send({ code: err.status || 500, message: err.message , err:err.stack})
    }
    else{
        res.status(500)
        return res.send({ code: 500, message: err })
    }

    

    

}

module.exports = {errorHandler}