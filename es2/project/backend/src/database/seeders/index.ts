import dotenv from 'dotenv';
import { syncDatabase } from '../../models';
import seedCategories from './categorySeeder';
import seedPizzaOptions from './pizzaOptionSeeder';
import seedProducts from './productSeeder';

// Load environment variables
dotenv.config();

/**
 * Main seeder function to populate the database with initial data
 */
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Sync database models - set to true to force recreate tables (caution: deletes all data)
    await syncDatabase(true);
    console.log('Database synchronized successfully');
    
    // Seed categories
    await seedCategories();
    console.log('Categories seeded successfully');
    
    // Seed pizza options
    await seedPizzaOptions();
    console.log('Pizza options seeded successfully');
    
    // Seed products
    await seedProducts();
    console.log('Products seeded successfully');
    
    console.log('Database seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Execute seeder if run directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;