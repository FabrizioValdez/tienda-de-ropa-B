import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Brand from './Brand';
import Category from './Category';

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  stock: number;
  brand_id: number | null;
  category_id: number | null;
  size: string | null;
  color: string | null;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'image_url' | 'brand_id' | 'category_id' | 'size' | 'color'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public image_url!: string | null;
  public stock!: number;
  public brand_id!: number | null;
  public category_id!: number | null;
  public size!: string | null;
  public color!: string | null;

  // Asociaciones (populated by Sequelize)
  public Brand?: Brand;
  public Category?: Category;
}

Product.init(
  {
    id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name:        { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    image_url:   { type: DataTypes.STRING, allowNull: true },
    stock:       { type: DataTypes.INTEGER, defaultValue: 0 },
    brand_id:    { type: DataTypes.INTEGER, allowNull: true, references: { model: 'brands', key: 'id' } },
    category_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'categories', key: 'id' } },
    size:        { type: DataTypes.STRING(10), allowNull: true },
    color:       { type: DataTypes.STRING(50), allowNull: true },
  },
  { sequelize, tableName: 'products', timestamps: true }
);

// Asociaciones
Product.belongsTo(Brand,    { foreignKey: 'brand_id',    as: 'Brand' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' });
Brand.hasMany(Product,      { foreignKey: 'brand_id' });
Category.hasMany(Product,   { foreignKey: 'category_id' });

export default Product;