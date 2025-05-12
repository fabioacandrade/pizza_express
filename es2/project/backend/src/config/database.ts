import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'pizza_db',
  process.env.DB_USER || 'pizza_user',
  process.env.DB_PASSWORD || 'senhaforte123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    timezone: '-03:00', // Set timezone for Brazil
    define: {
      timestamps: true, // Add createdAt and updatedAt
      underscored: true, // Use snake_case for fields
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test database connection
export const testDbConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('📦 Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;
