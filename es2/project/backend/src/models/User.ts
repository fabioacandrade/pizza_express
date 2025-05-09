import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Address from './Address';
import PaymentMethod from './PaymentMethod';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Add association fields
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Association properties
  public readonly addresses?: Address[];
  public readonly paymentMethods?: PaymentMethod[];
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'users',
  modelName: 'User'
});

export default User;