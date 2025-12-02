import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';
import server from './server';
import mongoDb from '@src/repos/MongoDb';


(async () => {
  try {
    await mongoDb.connect();
    logger.info('Connected to MongoDB');

    server.listen(ENV.Port, error => {
      if (!!error) {
        logger.err(error.message);
      } else {
        logger.info( 'Express server started on port: ' + ENV.Port.toString());
      }
    });

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
