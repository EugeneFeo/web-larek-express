import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, total }: { items: string[]; total: number } = req.body;

    const products = await Product.find({ _id: { $in: items } });

    const orderProducts = items.map((id) => products.find(
      (product) => product._id.toString() === id.toLowerCase(),
    ));

    if (orderProducts.some((product) => !product)) {
      throw new BadRequestError('Один из товаров не найден');
    }

    if (orderProducts.some((product) => product?.price == null)) {
      throw new BadRequestError('Один из товаров не продаётся');
    }

    const orderTotal = orderProducts.reduce(
      (sum, product) => sum + (product?.price ?? 0),
      0,
    );

    if (orderTotal !== total) {
      throw new BadRequestError('Неверная сумма заказа');
    }

    res.send({
      id: randomUUID(),
      total: orderTotal,
    });
  } catch (error) {
    next(error);
  }
};

export default createOrder;
