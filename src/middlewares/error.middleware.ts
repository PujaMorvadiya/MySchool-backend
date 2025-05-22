// =================== packages ====================
import { NextFunction, Request, Response } from 'express';
import { logger } from '@/common/util/logger';
import { HttpException } from '@/common/exceptions/HttpException';
import { generalResponse } from '@/common/helper/common.helper';

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    return generalResponse(res, [], message, 'error', error.toast ?? false, status);
  } catch (error) {
    next(error);
  }
};
