import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  status?: number;
}

const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = error.statusCode || error.status || 500;

  const message = statusCode >= 500
    ? 'Ошибка сервера'
    : error.message;

  res.status(statusCode).send({ message });
};

export default errorHandler;
