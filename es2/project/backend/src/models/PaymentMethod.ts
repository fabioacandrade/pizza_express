import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface PaymentMethodAttributes {
  id: string;
  userId: string;
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CASH';
  details: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentMethodCreationAttributes extends Optional<PaymentMethodAttributes, 'id'> {}

class PaymentMethod extends Model<PaymentMethodAttributes, PaymentMethodCreationAttributes> implements PaymentMethodAttributes {
  public id!: string;
  public userId!: string;
  public type!: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CASH';
  public details!: string;
  public isDefault!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Associação
  public readonly user?: User;
}

PaymentMethod.init({
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
  type: {
    type: DataTypes.ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH'),
    allowNull: false
  },
  details: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  tableName: 'payment_methods',
  modelName: 'PaymentMethod'
});

export default PaymentMethod;