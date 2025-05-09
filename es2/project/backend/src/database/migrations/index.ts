import { Sequelize } from 'sequelize';
import sequelize from '../../config/database';
import { addCategoryToProducts } from './addCategoryToProducts';

/**
 * Execute todas as migrações pendentes
 */
async function runMigrations(): Promise<void> {
  try {
    console.log('🚀 Iniciando migrações do banco de dados...');
    
    // Obter o queryInterface do Sequelize
    const queryInterface = sequelize.getQueryInterface();
    
    // Executar migração para adicionar a coluna category
    await addCategoryToProducts(queryInterface);
    
    console.log('✅ Todas as migrações foram executadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    process.exit(1);
  }
}

// Executar as migrações
runMigrations();