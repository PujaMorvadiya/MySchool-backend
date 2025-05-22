import { logger } from './common/util/logger';

// const routes = [];

const main = async () => {
  try {
    // await db.authenticate();
    // const apiRoutes = routes;
    // await initializeApp(apiRoutes);
  } catch (err) {
    logger.error('[SERVER START]: %s', err);
    process.exit(1);
  }
};

main();
