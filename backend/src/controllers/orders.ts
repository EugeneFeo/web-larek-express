import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import validator from 'validator';
import Product from '../models/product';

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      items, total, payment, email, phone, address,
    } = req.body;

    if (
      !Array.isArray(items)
      || items.length === 0
      || !items.every(
        (id) => typeof id === 'string'
          && mongoose.isObjectIdOrHexString(id),
      )
    ) {
      res.status(400).send({ message: 'Передайте массив ID товаров' });
      return;
    }

    if (
      typeof total !== 'number'
      || !Number.isFinite(total)
      || !['card', 'online'].includes(payment)
      || typeof email !== 'string'
      || !validator.isEmail(email)
      || typeof phone !== 'string'
      || !phone.trim()
      || typeof address !== 'string'
      || !address.trim()
    ) {
      res.status(400).send({ message: 'Некорректные данные заказа' });
      return;
    }

    const products = await Product.find({ _id: { $in: items } });

    const orderProducts = items.map((id: string) => products.find(
      (product) => product._id.toString() === id.toLowerCase(),
    ));

    if (orderProducts.some((product) => !product)) {
      res.status(404).send({ message: 'Товар не найден' });
      return;
    }

    if (orderProducts.some((product) => product?.price == null)) {
      res.status(400).send({ message: 'Один из товаров не продаётся' });
      return;
    }

    const orderTotal = orderProducts.reduce(
      (sum, product) => sum + (product?.price ?? 0),
      0,
    );

    if (orderTotal !== total) {
      res.status(400).send({ message: 'Неверная сумма заказа' });
      return;
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
