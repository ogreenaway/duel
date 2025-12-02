import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';
import server from './server';
import mongoDb from '@src/repos/MongoDb';


/******************************************************************************
                                Constants
******************************************************************************/

const SERVER_START_MSG = (
  'Express server started on port: ' + ENV.Port.toString()
);


/******************************************************************************
                                  Run
******************************************************************************/

// Connect to MongoDB and start the server
(async () => {
  try {
    // Initialize MongoDB connection
    await mongoDb.connect();
    logger.info('Connected to MongoDB');

    // Start the server
    server.listen(ENV.Port, err => {
      if (!!err) {
        logger.err(err.message);
      } else {
        logger.info(SERVER_START_MSG);
      }
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Shutting down gracefully...');
      await mongoDb.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Shutting down gracefully...');
      await mongoDb.close();
      process.exit(0);
    });

  } catch (error) {
    logger.err('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
})();
