/**
 * Enumeração para as categorias de produtos
 */
export enum ProductCategory {
  PIZZAS = 'PIZZAS',
  BEBIDAS = 'BEBIDAS',
  SOBREMESAS = 'SOBREMESAS',
  COMBOS = 'COMBOS'
}

/**
 * Interface para informações da categoria
 */
export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  description?: string;
  imageUrl?: string;
}

/**
 * Mapeamento de informações para cada categoria
 */
const CATEGORY_INFO: Record<ProductCategory, CategoryInfo> = {
  [ProductCategory.PIZZAS]: {
    id: ProductCategory.PIZZAS,
    name: 'Pizzas',
    description: 'Nossas deliciosas pizzas artesanais',
    imageUrl: 'https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  [ProductCategory.BEBIDAS]: {
    id: ProductCategory.BEBIDAS,
    name: 'Bebidas',
    description: 'Refrigerantes, sucos e cervejas',
    imageUrl: 'https://images.pexels.com/photos/2531187/pexels-photo-2531187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  [ProductCategory.SOBREMESAS]: {
    id: ProductCategory.SOBREMESAS,
    name: 'Sobremesas',
    description: 'Doces para adoçar seu dia',
    imageUrl: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  [ProductCategory.COMBOS]: {
    id: ProductCategory.COMBOS,
    name: 'Combos',
    description: 'Promoções especiais',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
};

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

/**
 * Obtém lista de todas as categorias como array
 */
export const getAllCategories = (): CategoryInfo[] => {
  return Object.values(CATEGORY_INFO);
};

/**
 * Obtém informações sobre uma categoria específica pelo ID
 */
export const getCategoryById = (id: ProductCategory): CategoryInfo | undefined => {
  return CATEGORY_INFO[id];
};