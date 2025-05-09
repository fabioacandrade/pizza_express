import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Address from './Address';
import PaymentMethod from './PaymentMethod';

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

interface OrderAttributes {
  id: string;
  userId: string;
  addressId: string;
  paymentMethodId: string;
  status: OrderStatus;
  total: number;
  deliveryFee: number;
  estimatedDeliveryTime?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public userId!: string;
  public addressId!: string;
  public paymentMethodId!: string;
  public status!: OrderStatus;
  public total!: number;
  public deliveryFee!: number;
  public estimatedDeliveryTime!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Associações
  public readonly user?: User;
  public readonly address?: Address;
  public readonly paymentMethod?: PaymentMethod;
}

Order.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  addressId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'addresses',
      key: 'id'
    }
  },
  paymentMethodId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'payment_methods',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      OrderStatus.RECEIVED,
      OrderStatus.PREPARING, 
      OrderStatus.OUT_FOR_DELIVERY, 
      OrderStatus.DELIVERED, 
      OrderStatus.CANCELED
    ),
    allowNull: false,
    defaultValue: OrderStatus.RECEIVED
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  estimatedDeliveryTime: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'orders',
  modelName: 'Order'
});

export default Order;