import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";

class Product extends Model {
  declare id: number;
  declare createdBy: number;
  declare title: string;
  declare description: string;
  declare shortDescription: string;
  declare isFeatured: boolean;
  declare productImage: string[];
  declare productUrl: string;
  declare tags: string[];
  declare category: string[];
  declare price: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      validate: {
        notNull: { msg: "User ID cannot be null" },
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title cannot be null" },
        notEmpty: { msg: "Title cannot be empty" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Description cannot be null" },
        notEmpty: { msg: "Description cannot be empty" },
      },
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Short description cannot be null" },
        notEmpty: { msg: "Short description cannot be empty" },
      },
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notNull: { msg: "isFeatured cannot be null" },
      },
    },
    productImage: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull: { msg: "Product image cannot be null" },
        notEmpty: { msg: "Product image cannot be empty" },
      },
    },
    productUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: { msg: "Must be a valid URL" },
        notNull: { msg: "Product URL cannot be null" },
        notEmpty: { msg: "Product URL cannot be empty" },
      },
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull: { msg: "Tags cannot be null" },
        notEmpty: { msg: "Tags cannot be empty" },
      },
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull: { msg: "Category cannot be null" },
        notEmpty: { msg: "Category cannot be empty" },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "Price cannot be null" },
        min: {
          args: [0],
          msg: "Price must be a positive value",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: "product",
  }
);

export default Product;
