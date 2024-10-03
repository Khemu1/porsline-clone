import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { GroupModel } from "../../types/types";

interface GroupModelCreationAttributes
  extends Optional<GroupModel, "id" | "createdAt" | "updatedAt"> {}

class Group
  extends Model<GroupModel, GroupModelCreationAttributes>
  implements GroupModel
{
  declare id: number;
  declare maker: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate() {}
}

// Initialize the model
Group.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    maker: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required",
        },
        notNull: {
          msg: "Name cannot be null",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: "group",
    timestamps: true,
  }
);
export default Group;
