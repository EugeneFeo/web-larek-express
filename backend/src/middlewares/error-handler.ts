import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

interface AppError extends Error {
  code?: number;
  status?: number;
}

const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error.code === 11000) {
    res.status(409).send({
      message: 'Товар с таким названием уже существует',
    });
    return;
  }

  if (
    error instanceof mongoose.Error.ValidationError
    || error instanceof mongoose.Error.CastError
    || error.status === 400
  ) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
    return;
  }

  res.status(500).send({ message: 'Ошибка сервера' });
};

export default errorHandler;
