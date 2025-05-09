import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PizzaOptionAttributes {
  id: string;
  name: string;
  type: 'SIZE' | 'DOUGH' | 'CRUST' | 'EXTRA';
  additionalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PizzaOptionCreationAttributes extends Optional<PizzaOptionAttributes, 'id'> {}

class PizzaOption extends Model<PizzaOptionAttributes, PizzaOptionCreationAttributes> implements PizzaOptionAttributes {
  public id!: string;
  public name!: string;
  public type!: 'SIZE' | 'DOUGH' | 'CRUST' | 'EXTRA';
  public additionalPrice!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PizzaOption.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('SIZE', 'DOUGH', 'CRUST', 'EXTRA'),
    allowNull: false
  },
  additionalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  sequelize,
  tableName: 'pizza_options',
  modelName: 'PizzaOption'
});

export default PizzaOption;