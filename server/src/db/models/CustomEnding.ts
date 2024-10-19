import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

import { CustomEndingModel } from "../../types/types";

interface CustomEndingCreationAttributes
  extends Optional<
    CustomEndingModel,
    "createdAt" | "updatedAt" | "id" | "label"
  > {}
class CustomEnding
  extends Model<CustomEndingModel, CustomEndingCreationAttributes>
  implements CustomEndingModel
{
  declare id: number;
  declare surveyId: number;
  declare redirectUrl: string;
  declare type: "default" | "custom";
  declare label?: string;
  declare description?: string;
  declare shareSurvey?: boolean;
  declare defaultEnding?: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate() {}
}

CustomEnding.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    surveyId: {
      type: DataTypes.INTEGER,
      references: {
        model: "survey",
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["default", "custom"],
      allowNull: false,
    },
    redirectUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    label: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    shareSurvey: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    defaultEnding: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "custom_end",
    timestamps: true,
  }
);

export default CustomEnding;
