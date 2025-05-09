import { Product, Category } from '../../models';

/**
 * Seed products into the database
 */
const seedProducts = async (): Promise<void> => {
  // Get category IDs
  const pizzaCategory = await Category.findOne({ where: { name: 'Pizzas' } });
  const drinkCategory = await Category.findOne({ where: { name: 'Bebidas' } });
  const dessertCategory = await Category.findOne({ where: { name: 'Sobremesas' } });

  if (!pizzaCategory || !drinkCategory || !dessertCategory) {
    throw new Error('Categories not found. Run category seeder first.');
  }

  const products = [
    // Pizzas
    {
      name: 'Margherita',
      description: 'Molho de tomate, queijo mussarela, tomate e manjericão fresco',
      basePrice: 35.00,
      type: 'PIZZA',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/1552641/pexels-photo-1552641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: pizzaCategory.id
    },
    {
      name: 'Calabresa',
      description: 'Molho de tomate, queijo mussarela e calabresa fatiada',
      basePrice: 38.00,
      type: 'PIZZA',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: pizzaCategory.id
    },
    {
      name: 'Quatro Queijos',
      description: 'Molho de tomate, queijo mussarela, provolone, parmesão e gorgonzola',
      basePrice: 42.00,
      type: 'PIZZA',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: pizzaCategory.id
    },
    {
      name: 'Vegetariana',
      description: 'Molho de tomate, queijo mussarela, tomate, pimentão, cebola, cogumelo e azeitona',
      basePrice: 40.00,
      type: 'PIZZA',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: pizzaCategory.id
    },
    {
      name: 'Frango com Catupiry',
      description: 'Molho de tomate, queijo mussarela, frango desfiado e catupiry',
      basePrice: 45.00,
      type: 'PIZZA',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: pizzaCategory.id
    },
    {
      name: 'Pepperoni',
      description: 'Molho de tomate, queijo mussarela e pepperoni',
      basePrice: 48.00,
      type: 'PIZZA',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: pizzaCategory.id
    },
    
    // Drinks
    {
      name: 'Refrigerante Coca-Cola 2L',
      description: 'Garrafa de Coca-cola 2 litros',
      basePrice: 12.00,
      type: 'DRINK',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: drinkCategory.id
    },
    {
      name: 'Refrigerante Guaraná 2L',
      description: 'Garrafa de Guaraná Antarctica 2 litros',
      basePrice: 10.00,
      type: 'DRINK',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: drinkCategory.id
    },
    {
      name: 'Suco de Laranja 1L',
      description: 'Suco de laranja natural 1 litro',
      basePrice: 15.00,
      type: 'DRINK',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: drinkCategory.id
    },
    {
      name: 'Água Mineral 500ml',
      description: 'Garrafa de água mineral 500ml',
      basePrice: 5.00,
      type: 'DRINK',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: drinkCategory.id
    },
    
    // Desserts
    {
      name: 'Petit Gateau',
      description: 'Bolo de chocolate com recheio cremoso acompanhado de sorvete de baunilha',
      basePrice: 20.00,
      type: 'DESSERT',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/3992131/pexels-photo-3992131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: dessertCategory.id
    },
    {
      name: 'Cheesecake',
      description: 'Tradicional cheesecake com calda de frutas vermelhas',
      basePrice: 18.00,
      type: 'DESSERT',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: dessertCategory.id
    },
    {
      name: 'Pudim de Leite',
      description: 'Clássico pudim de leite condensado com calda de caramelo',
      basePrice: 15.00,
      type: 'DESSERT',
      available: true,
      imageUrl: 'https://images.pexels.com/photos/5699796/pexels-photo-5699796.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      categoryId: dessertCategory.id
    }
  ];

  // Create products in database
  for (const product of products) {
    await Product.create(product);
  }
};

export default seedProducts;