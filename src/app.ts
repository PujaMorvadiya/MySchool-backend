import express, { Application } from 'express';
import { NODE_ENV, PORT } from './config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware';
import { logger } from './common/util/logger';
import * as http from 'http';
import passport from 'passport';
import { auth } from './middlewares/passport.middleware';
import { Transaction } from 'sequelize';
import db from './models';
import { Routes } from './interfaces/routes.interface';

const app: Application = express();
const env: string = NODE_ENV || 'development';
const port: string | number = PORT || 8000;

function initializeMiddleWares() {
  app.use(express.json());
  app.use(cors({ credentials: true, origin: true }));
  app.use(cookieParser());
  app.use(passport.initialize());
  auth(passport);
  app.use((req, res, next) => {
    global.currentRequest = req;
    global.currentResponse = res;
    next();
  });

  app.use(async (req, res, next) => {
    const method = req.method.toLowerCase();
    if (method !== 'get') {
      const t: Transaction = await db.transaction();
      req.transaction = t;
    }
    next();
  });
}
function initializeRoutes(routes: Routes[]) {
  routes.forEach((route) => {
    app.use('/api/v1', route.router);
  });

  this.router.get('/memory-usage', (req, res) => {
    const memoryUsage = process.memoryUsage();
    res.json({
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      external: (memoryUsage.external / 1024 / 1024).toFixed(2) + ' MB',
      arrayBuffers: (memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2) + ' MB',
    });
  });
}

function initializeErrorHandling() {
  app.use(errorMiddleware);
}

function handle404() {
  app.use((req, res) => {
    if (req.transaction) {
      req.transaction.rollback();
    }

    res.status(500).send('Something went wrong');
  });
}
export const initializeApp = async (apiRoutes: Routes[]) => {
  initializeMiddleWares();
  initializeRoutes(apiRoutes);
  initializeErrorHandling();
  handle404();
  const server = http.createServer(app);
  // initializeSocket(server);
  server.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${env} ========`);
    logger.info(`=================================`);
  });
};
