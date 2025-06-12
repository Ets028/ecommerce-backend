import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World! This is the API server.');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes)
app.use('/api/payment', paymentRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});