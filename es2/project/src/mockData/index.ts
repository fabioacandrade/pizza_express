import { Address, CartItem, Category, Order, OrderStatus, PaymentMethod, Product, Promotion, User } from '../types';

export const sampleUser: User = {
  id: 'user1',
  name: 'Demo User',
  email: 'demo@example.com',
  phone: '(11) 99999-9999',
  addresses: [
    {
      id: '1',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      isDefault: true
    },
    {
      id: '2',
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Sala 123',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: false
    }
  ],
  paymentMethods: [
    {
      id: '1',
      type: 'CREDIT_CARD',
      cardBrand: 'VISA',
      lastDigits: '1234',
      holderName: 'DEMO USER',
      isDefault: true
    },
    {
      id: '2',
      type: 'PIX',
      pixKey: 'demo@example.com',
      isDefault: false
    }
  ]
};

export const categories: Category[] = [
  {
    id: '1',
    name: 'Pizzas',
    description: 'Nossas deliciosas pizzas artesanais',
    imageUrl: 'https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '2',
    name: 'Bebidas',
    description: 'Refrigerantes, sucos e cervejas',
    imageUrl: 'https://images.pexels.com/photos/2531187/pexels-photo-2531187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '3',
    name: 'Sobremesas',
    description: 'Doces para adoçar seu dia',
    imageUrl: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '4',
    name: 'Combos',
    description: 'Promoções especiais',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

export const pizzaProducts: Product[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela, manjericão fresco e azeite',
    basePrice: 39.90,
    type: 'PIZZA',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '1',
    availableOptions: [
      { id: '1', name: 'Pequena (25cm)', type: 'SIZE', additionalPrice: -5.00 },
      { id: '2', name: 'Média (30cm)', type: 'SIZE', additionalPrice: 0.00 },
      { id: '3', name: 'Grande (35cm)', type: 'SIZE', additionalPrice: 10.00 },
      { id: '4', name: 'Massa Tradicional', type: 'DOUGH', additionalPrice: 0.00 },
      { id: '5', name: 'Massa Integral', type: 'DOUGH', additionalPrice: 3.00 },
      { id: '6', name: 'Sem Borda', type: 'CRUST', additionalPrice: 0.00 },
      { id: '7', name: 'Borda Recheada com Catupiry', type: 'CRUST', additionalPrice: 7.00 },
      { id: '8', name: 'Cheddar Extra', type: 'EXTRA', additionalPrice: 5.00 },
      { id: '9', name: 'Pepperoni', type: 'EXTRA', additionalPrice: 8.00 }
    ]
  },
  {
    id: '2',
    name: 'Pizza Calabresa',
    description: 'Molho de tomate, mussarela, calabresa fatiada e cebola',
    basePrice: 42.90,
    type: 'PIZZA',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/6605216/pexels-photo-6605216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '1',
    availableOptions: [
      { id: '1', name: 'Pequena (25cm)', type: 'SIZE', additionalPrice: -5.00 },
      { id: '2', name: 'Média (30cm)', type: 'SIZE', additionalPrice: 0.00 },
      { id: '3', name: 'Grande (35cm)', type: 'SIZE', additionalPrice: 10.00 },
      { id: '4', name: 'Massa Tradicional', type: 'DOUGH', additionalPrice: 0.00 },
      { id: '5', name: 'Massa Integral', type: 'DOUGH', additionalPrice: 3.00 },
      { id: '6', name: 'Sem Borda', type: 'CRUST', additionalPrice: 0.00 },
      { id: '7', name: 'Borda Recheada com Catupiry', type: 'CRUST', additionalPrice: 7.00 },
      { id: '8', name: 'Cheddar Extra', type: 'EXTRA', additionalPrice: 5.00 },
      { id: '9', name: 'Pepperoni', type: 'EXTRA', additionalPrice: 8.00 }
    ]
  },
  {
    id: '3',
    name: 'Pizza Quatro Queijos',
    description: 'Molho de tomate, mussarela, provolone, parmesão e gorgonzola',
    basePrice: 45.90,
    type: 'PIZZA',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/13814644/pexels-photo-13814644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '1',
    availableOptions: [
      { id: '1', name: 'Pequena (25cm)', type: 'SIZE', additionalPrice: -5.00 },
      { id: '2', name: 'Média (30cm)', type: 'SIZE', additionalPrice: 0.00 },
      { id: '3', name: 'Grande (35cm)', type: 'SIZE', additionalPrice: 10.00 },
      { id: '4', name: 'Massa Tradicional', type: 'DOUGH', additionalPrice: 0.00 },
      { id: '5', name: 'Massa Integral', type: 'DOUGH', additionalPrice: 3.00 },
      { id: '6', name: 'Sem Borda', type: 'CRUST', additionalPrice: 0.00 },
      { id: '7', name: 'Borda Recheada com Catupiry', type: 'CRUST', additionalPrice: 7.00 },
      { id: '8', name: 'Cheddar Extra', type: 'EXTRA', additionalPrice: 5.00 },
      { id: '9', name: 'Pepperoni', type: 'EXTRA', additionalPrice: 8.00 }
    ]
  }
];

export const drinkProducts: Product[] = [
  {
    id: '4',
    name: 'Refrigerante Cola 2L',
    description: 'Refrigerante de cola garrafa 2 litros',
    basePrice: 10.90,
    type: 'DRINK',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/2531187/pexels-photo-2531187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '2'
  },
  {
    id: '5',
    name: 'Suco de Laranja 500ml',
    description: 'Suco natural de laranja garrafa 500ml',
    basePrice: 8.90,
    type: 'DRINK',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '2'
  },
  {
    id: '6',
    name: 'Cerveja Artesanal IPA 500ml',
    description: 'Cerveja artesanal tipo IPA, garrafa 500ml',
    basePrice: 15.90,
    type: 'DRINK',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '2'
  },
  {
    id: '7',
    name: 'Água Mineral 500ml',
    description: 'Água mineral sem gás, garrafa 500ml',
    basePrice: 4.90,
    type: 'DRINK',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '2'
  }
];

export const dessertProducts: Product[] = [
  {
    id: '8',
    name: 'Brownie com Sorvete',
    description: 'Brownie caseiro com sorvete de baunilha e calda de chocolate',
    basePrice: 18.90,
    type: 'DESSERT',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '3'
  },
  {
    id: '9',
    name: 'Petit Gateau',
    description: 'Bolo de chocolate quente com centro derretido e sorvete',
    basePrice: 22.90,
    type: 'DESSERT',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '3'
  },
  {
    id: '10',
    name: 'Cheesecake de Frutas Vermelhas',
    description: 'Cheesecake cremoso com calda de frutas vermelhas',
    basePrice: 16.90,
    type: 'DESSERT',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '3'
  }
];

export const comboProducts: Product[] = [
  {
    id: '11',
    name: 'Combo Família',
    description: 'Pizza grande (até 2 sabores) + 2 refrigerantes 2L',
    basePrice: 89.90,
    type: 'OTHER',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '4'
  },
  {
    id: '12',
    name: 'Combo Casal',
    description: 'Pizza média + 2 cervejas artesanais + 1 sobremesa',
    basePrice: 99.90,
    type: 'OTHER',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/5060452/pexels-photo-5060452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '4'
  },
  {
    id: '13',
    name: 'Combo Festa',
    description: '2 pizzas grandes + 3 refrigerantes 2L + 2 sobremesas',
    basePrice: 159.90,
    type: 'OTHER',
    available: true,
    imageUrl: 'https://images.pexels.com/photos/7438073/pexels-photo-7438073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    categoryId: '4'
  }
];

export const allProducts: Product[] = [...pizzaProducts, ...drinkProducts, ...dessertProducts, ...comboProducts];

export const promotions: Promotion[] = [
  {
    id: '1',
    title: 'SUPER SEGUNDA!',
    description: 'Todas as pizzas médias com 30% de desconto',
    imageUrl: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    discountType: 'PERCENTAGE',
    discountValue: 30,
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-08-01T23:59:59Z'
  },
  {
    id: '2',
    title: 'COMBO FAMÍLIA',
    description: 'Pizza grande + 2 refrigerantes com 15% OFF',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    code: 'FAMILIA15',
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-08-01T23:59:59Z'
  },
  {
    id: '3',
    title: 'FRETE GRÁTIS',
    description: 'Em compras acima de R$50',
    imageUrl: 'https://images.pexels.com/photos/5060548/pexels-photo-5060548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    discountType: 'FIXED_VALUE',
    discountValue: 0,
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-08-01T23:59:59Z'
  }
];

export const sampleOrders: Order[] = [
  {
    id: '1',
    userId: 'user1',
    items: [
      {
        productId: '1',
        quantity: 1,
        selectedOptions: [
          { id: '2', name: 'Média (30cm)', type: 'SIZE', additionalPrice: 0.00 },
          { id: '4', name: 'Massa Tradicional', type: 'DOUGH', additionalPrice: 0.00 },
          { id: '6', name: 'Sem Borda', type: 'CRUST', additionalPrice: 0.00 }
        ],
        totalPrice: 39.90
      },
      {
        productId: '4',
        quantity: 1,
        totalPrice: 10.90
      }
    ],
    status: 'DELIVERED',
    createdAt: '2025-05-10T18:30:00Z',
    updatedAt: '2025-05-10T19:15:00Z',
    totalAmount: 50.80,
    deliveryAddress: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    paymentMethod: 'CREDIT_CARD'
  },
  {
    id: '2',
    userId: 'user2',
    items: [
      {
        productId: '11',
        quantity: 1,
        totalPrice: 89.90
      }
    ],
    status: 'IN_PREPARATION',
    createdAt: '2025-05-11T19:00:00Z',
    updatedAt: '2025-05-11T19:05:00Z',
    totalAmount: 89.90,
    deliveryAddress: {
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Sala 123',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    paymentMethod: 'PIX'
  }
];