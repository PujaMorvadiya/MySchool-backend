import { Transaction } from 'sequelize';

declare global {
  namespace Express {
    interface Request {
      transaction?: Transaction;
    }
  }
}
