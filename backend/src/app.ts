import path from 'path';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { PORT, DB_ADDRESS } from './config';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

app.use(requestLogger);

app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../public')));

app.use('/product', productsRouter);
app.use('/order', ordersRouter);

app.use((_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_ADDRESS)
  .then(() => {
    app.listen(PORT);
  })
  .catch(() => {
    process.stderr.write('Не удалось подключиться к MongoDB\n');
    process.exitCode = 1;
  });