import { Sequelize, QueryInterface, DataTypes } from 'sequelize';
import { ProductCategory } from '../../types/enums';

/**
 * Migração para adicionar coluna 'category' na tabela 'products'
 */
export async function addCategoryToProducts(queryInterface: QueryInterface): Promise<void> {
  try {
    console.log('🔄 Iniciando migração: Adicionando coluna "category" à tabela "products"');
    
    // Convertendo enum ProductCategory para array de strings
    const categoryValues = Object.values(ProductCategory);
    
    // Adicionando a coluna category à tabela products
    await queryInterface.addColumn('products', 'category', {
      type: DataTypes.ENUM(...categoryValues),
      allowNull: true // Inicialmente permitimos nulos para não quebrar registros existentes
    });
    
    // Definindo valor padrão para registros existentes
    // Para pizzas, definir categoria como PIZZAS, para as demais, uma categoria baseada no tipo
    await queryInterface.sequelize.query(`
      UPDATE products 
      SET category = CASE 
        WHEN type = 'PIZZA' THEN '${ProductCategory.PIZZAS}'
        WHEN type = 'DRINK' THEN '${ProductCategory.BEBIDAS}'
        WHEN type = 'DESSERT' THEN '${ProductCategory.SOBREMESAS}'
        ELSE '${ProductCategory.COMBOS}'
      END
    `);
    
    // Depois de atualizar todos os registros, defina a coluna como NOT NULL
    await queryInterface.changeColumn('products', 'category', {
      type: DataTypes.ENUM(...categoryValues),
      allowNull: false
    });
    
    console.log('✅ Migração concluída: Coluna "category" adicionada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error);
    throw error;
  }
}