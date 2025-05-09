import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import PizzaOption from './PizzaOption';
import { ProductCategory } from '../types/enums';

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  type: 'PIZZA' | 'DRINK' | 'DESSERT' | 'OTHER';
  available: boolean;
  imageUrl: string;
  category: ProductCategory;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public basePrice!: number;
  public type!: 'PIZZA' | 'DRINK' | 'DESSERT' | 'OTHER';
  public available!: boolean;
  public imageUrl!: string;
  public category!: ProductCategory;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associações podem ser acessadas após a definição do modelo
  public readonly availableOptions?: PizzaOption[];
}

Product.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('PIZZA', 'DRINK', 'DESSERT', 'OTHER'),
    allowNull: false
  },
  available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(...Object.values(ProductCategory)),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'products',
  modelName: 'Product'
});

export default Product;