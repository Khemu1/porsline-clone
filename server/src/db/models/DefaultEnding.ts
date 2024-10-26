import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

import { DefaultEndingModel } from "../../types/types";

interface DefaultEndingCreationAttributes
  extends Optional<DefaultEndingModel, "createdAt" | "updatedAt" | "id"> {}

class DefaultEnding
  extends Model<DefaultEndingModel, DefaultEndingCreationAttributes>
  implements DefaultEndingModel
{
  declare id: number;
  declare surveyId: number;
  declare label: string;
  declare type: "default" | "custom";
  declare imageUrl?: string;
  declare description?: string;
  declare shareSurvey?: boolean;
  declare buttonText?: string;
  declare anotherLink?: string;
  declare autoReload?: boolean;
  declare redirectToWhat?: string;
  declare reloadTimeInSeconds?: number;
  declare defaultEnding?: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate() {}
}

DefaultEnding.init(
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
    redirectToWhat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["default", "custom"],
      allowNull: false,
    },
    label: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shareSurvey: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    buttonText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reloadOrRedirect: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    anotherLink: {
      type: DataTypes.TEXT,
    },
    autoReload: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    reloadTimeInSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    defaultEnding: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "default_end",
    timestamps: true,
  }
);

export default DefaultEnding;
