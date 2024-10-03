import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { WorkSpaceModel } from "../../types/types";

interface WorkSpaceModelCreationAttributes
  extends Optional<WorkSpaceModel, "id" | "createdAt" | "updatedAt"> {}

class WorkSpace
  extends Model<WorkSpaceModel, WorkSpaceModelCreationAttributes>
  implements WorkSpaceModel
{
  declare id: number;
  declare maker: number;
  declare title: string;
  declare groupId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate() {}
}

// Initialize the model
WorkSpace.init(
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
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: "group",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is required",
        },
        notNull: {
          msg: "Title cannot be null",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "workspace",
    timestamps: true,
  }
);
export default WorkSpace;
