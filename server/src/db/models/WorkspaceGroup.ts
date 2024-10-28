import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { WorkspaceGroupModel } from "../../types/types";

interface WorkspaceGroupModelCreationAttributes
  extends Optional<WorkspaceGroupModel, "createdAt" | "updatedAt" | "id"> {}

class WorkspaceGroup
  extends Model<WorkspaceGroupModel, WorkspaceGroupModelCreationAttributes>
  implements WorkspaceGroupModel
{
  declare id: number;
  declare workspaceId: number;
  declare groupId: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate() {}
}

WorkspaceGroup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    workspaceId: {
      type: DataTypes.INTEGER,
      references: {
        model: "workspace",
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: "group",
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false, 
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false, 
    },
  },
  {
    sequelize,
    tableName: "WorkspaceGroup",
    timestamps: true,
  }
);

export default WorkspaceGroup;
