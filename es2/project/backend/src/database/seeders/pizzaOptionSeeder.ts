import { PizzaOption } from '../../models';

/**
 * Seed pizza options into the database
 */
const seedPizzaOptions = async (): Promise<void> => {
  // Define all pizza customization options
  const pizzaOptions = [
    // Size options
    { name: 'Pequena (25cm)', type: 'SIZE', additionalPrice: -5.00 },
    { name: 'Média (30cm)', type: 'SIZE', additionalPrice: 0.00 },
    { name: 'Grande (35cm)', type: 'SIZE', additionalPrice: 10.00 },
    
    // Dough options
    { name: 'Massa Tradicional', type: 'DOUGH', additionalPrice: 0.00 },
    { name: 'Massa Integral', type: 'DOUGH', additionalPrice: 3.00 },
    { name: 'Massa Fina', type: 'DOUGH', additionalPrice: 0.00 },
    
    // Crust options
    { name: 'Sem Borda', type: 'CRUST', additionalPrice: 0.00 },
    { name: 'Borda Recheada com Catupiry', type: 'CRUST', additionalPrice: 7.00 },
    { name: 'Borda Recheada com Cheddar', type: 'CRUST', additionalPrice: 7.00 },
    
    // Extra options
    { name: 'Cheddar Extra', type: 'EXTRA', additionalPrice: 5.00 },
    { name: 'Pepperoni', type: 'EXTRA', additionalPrice: 8.00 },
    { name: 'Bacon', type: 'EXTRA', additionalPrice: 6.00 },
    { name: 'Champignon', type: 'EXTRA', additionalPrice: 5.00 },
    { name: 'Borda com Requeijão', type: 'EXTRA', additionalPrice: 7.00 }
  ];

  // Create pizza options in database
  for (const option of pizzaOptions) {
    await PizzaOption.create(option);
  }
};

export default seedPizzaOptions;