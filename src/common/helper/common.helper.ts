import { Response } from 'express';

export const generalResponse = (
  response: Response,
  data: any = [],
  message = '',
  responseType = 'success',
  toast = false,
  statusCode = 200,
) => {
  response.status(statusCode).send({
    data: data,
    message: message,
    toast: toast,
    responseType: responseType,
  });
};
