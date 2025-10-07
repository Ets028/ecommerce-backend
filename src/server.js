import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import './config/passport.js'; // Import passport configuration to register strategies
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import googleAuthRoutes from './routes/googleAuth.routes.js';
import { globalErrorHandler, notFoundHandler } from './utils/errorHandler.js';
import logger from './config/logger.js';
import { requestLogger, errorLogger } from './middlewares/logging.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get the current directory name (since __dirname is not available in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logging middleware - should be first
app.use(requestLogger);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Initialize Passport for Google OAuth
app.use(passport.initialize());

// Static file serving is no longer needed for product images as they are stored on Cloudinary
// app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Error logging middleware
app.use(errorLogger);

app.get('/', (req, res) => {
    res.send('Hello, World! This is the API server.');
});

app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);  // Google auth routes under /api/auth
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payment', paymentRoutes);

// Handle 404 for undefined routes
app.use(notFoundHandler);

// Global error handler - this should be the last middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`, {
        port: PORT,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});