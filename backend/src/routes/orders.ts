import { Router } from 'express';
import createOrder from '../controllers/orders';
import { validateOrderBody } from '../middlewares/validation';

const router = Router();

router.post('/', validateOrderBody, createOrder);

export default router;
