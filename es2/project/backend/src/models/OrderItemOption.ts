import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import OrderItem from './OrderItem';
import PizzaOption from './PizzaOption';

class OrderItemOption extends Model {
  public orderItemId!: string;
  public pizzaOptionId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Associações
  public readonly orderItem?: OrderItem;
  public readonly option?: PizzaOption;
}

OrderItemOption.init({
  orderItemId: {
    type: DataTypes.UUID,
    primaryKey: true,
    field: 'order_item_id',
    references: {
      model: 'order_items',
      key: 'id'
    }
  },
  pizzaOptionId: {
    type: DataTypes.UUID,
    primaryKey: true,
    field: 'pizza_option_id',
    references: {
      model: 'pizza_options',
      key: 'id'
    }
  }
}, {
  sequelize,
  tableName: 'order_item_options',
  modelName: 'OrderItemOption',
  underscored: true
});

export default OrderItemOption;