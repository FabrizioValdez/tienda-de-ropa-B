import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BrandAttributes {
  id: number;
  name: string;
}

interface BrandCreationAttributes extends Optional<BrandAttributes, 'id'> {}

class Brand extends Model<BrandAttributes, BrandCreationAttributes> implements BrandAttributes {
  public id!: number;
  public name!: string;
}

Brand.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { sequelize, tableName: 'brands', timestamps: true }
);

export default Brand;