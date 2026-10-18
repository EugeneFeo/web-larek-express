import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  Product.find({})
    .then((items) => res.send({ items, total: items.length }))
    .catch(next);
};

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    title, image, category, description, price,
  } = req.body;

  Product.create({
    title,
    image,
    category,
    description,
    price,
  })
    .then((product) => res.status(201).send(product))
    .catch((error) => {
      if (
        error instanceof mongoose.Error.ValidationError
        || error instanceof mongoose.Error.CastError
      ) {
        next(new BadRequestError(
          'Ошибка валидации данных при создании товара',
        ));
        return;
      }

      if (error instanceof Error && error.message.includes('E11000')) {
        next(new ConflictError(
          'Товар с таким названием уже существует',
        ));
        return;
      }

      next(error);
    });
};
