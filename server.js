const mongoose = require('mongoose');
const app = require('./app');
const config = require('./_helper/config');
const logger = require('./_helper/logger');

const {dbConnect, closeDB } =  require('./_helper/dbConn')

// const {getCacheClient} = require('./_helper/init_redis')


const server = app.listen(config.server.port,   () => {
    logger.info('Server listening on port ' + config.server.port);
    logger.info("Node Version "+ process.version);
    dbConnect()
    // getCacheClient()

}).on('error', function(err){
    logger.info('Express Server Error');   
    logger.info(err);
});



const cleanUp =  (eventType) => {
  if (server) {
    server.close(() => {
      logger.info(`Server closed... Event : ${eventType} Recived`);
      closeDB();
      // closeRedis()
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};


if (config.env==="production"){
  [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`,  `SIGTERM`, 'uncaughtException','unhandledRejection']
  .forEach((eventType) => {
    process.on(eventType, cleanUp.bind(null, eventType));
  })
}

  

