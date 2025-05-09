import sequelize from '../config/database';
import Product from './Product';
import PizzaOption from './PizzaOption';
import User from './User';
import Address from './Address';
import PaymentMethod from './PaymentMethod';
import Order from './Order';
import OrderItem from './OrderItem';
import OrderItemOption from './OrderItemOption';

// Define model associations
const defineAssociations = () => {
  // User has many Addresses
  User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
  Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
  // User has many PaymentMethods
  User.hasMany(PaymentMethod, { foreignKey: 'userId', as: 'paymentMethods' });
  PaymentMethod.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
  // User has many Orders
  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
  Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
  // Order belongs to Address and PaymentMethod
  Order.belongsTo(Address, { foreignKey: 'addressId', as: 'address' });
  Address.hasMany(Order, { foreignKey: 'addressId', as: 'orders' });
  
  Order.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId', as: 'paymentMethod' });
  PaymentMethod.hasMany(Order, { foreignKey: 'paymentMethodId', as: 'orders' });
  
  // Order has many OrderItems
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  
  // OrderItem belongs to Product
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
  Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
  
  // OrderItem has many PizzaOptions through OrderItemOption
  OrderItem.belongsToMany(PizzaOption, { 
    through: OrderItemOption,
    foreignKey: 'orderItemId',
    otherKey: 'pizzaOptionId',
    as: 'selectedOptions'
  });
  
  PizzaOption.belongsToMany(OrderItem, { 
    through: OrderItemOption,
    foreignKey: 'pizzaOptionId',
    otherKey: 'orderItemId',
    as: 'orderItems'
  });
  
  // Also add direct associations for OrderItemOption
  OrderItem.hasMany(OrderItemOption, { foreignKey: 'orderItemId', as: 'options' });
  OrderItemOption.belongsTo(OrderItem, { foreignKey: 'orderItemId', as: 'orderItem' });
  
  PizzaOption.hasMany(OrderItemOption, { foreignKey: 'pizzaOptionId', as: 'orderItemOptions' });
  OrderItemOption.belongsTo(PizzaOption, { foreignKey: 'pizzaOptionId', as: 'option' });
};

// Initialize associations
defineAssociations();

// Function to sync all models with the database
export const syncDatabase = async (force = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log(`Database & tables ${force ? 're-created' : 'synchronized'}`);
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

export {
  sequelize,
  Product,
  PizzaOption,
  User,
  Address,
  PaymentMethod,
  Order,
  OrderItem,
  OrderItemOption
};