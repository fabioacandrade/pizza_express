import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { testDbConnection } from './config/database';
import { syncDatabase } from './models';

// Import routes
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import pizzaOptionRoutes from './routes/pizzaOptionRoutes';
import addressRoutes from './routes/addressRoutes';
import paymentMethodRoutes from './routes/paymentMethodRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';

// Initialize Express app
const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Pizza Express API is running');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pizza-options', pizzaOptionRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testDbConnection();
    
    // Sync database (set force to true only in development to recreate tables)
    const forceSync = process.env.NODE_ENV === 'development' && process.env.DB_FORCE_SYNC === 'true';
    await syncDatabase(forceSync);
    
    app.listen(port, () => {
      console.log(`⚡️ Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
