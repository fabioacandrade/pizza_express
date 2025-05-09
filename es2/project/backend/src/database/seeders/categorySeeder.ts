import { Category } from '../../models';

/**
 * Seed categories into the database
 */
const seedCategories = async (): Promise<void> => {
  const categories = [
    {
      name: 'Pizzas',
      description: 'Nossas deliciosas pizzas artesanais',
      imageUrl: 'https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'Bebidas',
      description: 'Refrigerantes, sucos e cervejas',
      imageUrl: 'https://images.pexels.com/photos/2531187/pexels-photo-2531187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'Sobremesas',
      description: 'Doces para adoçar seu dia',
      imageUrl: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'Combos',
      description: 'Promoções especiais',
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ];

  // Create categories in database
  for (const category of categories) {
    await Category.create(category);
  }
};

export default seedCategories;