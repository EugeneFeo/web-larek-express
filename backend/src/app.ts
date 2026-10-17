import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import errorHandler from './middlewares/error-handler';

dotenv.config();

const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek',
} = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../public')));

app.use('/product', productsRouter);
app.use('/order', ordersRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Маршрут не найден' });
});

app.use(errorHandler);

mongoose.connect(DB_ADDRESS)
  .then(() => {
    app.listen(PORT);
  })
  .catch(() => {
    process.stderr.write('Не удалось подключиться к MongoDB\n');
    process.exitCode = 1;
  });