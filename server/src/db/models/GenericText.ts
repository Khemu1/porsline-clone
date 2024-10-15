import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

import { GenericTextModel } from "../../types/types";

interface GenericTextModelCreationAttributes
  extends Optional<
    GenericTextModel,
    | "createdAt"
    | "updatedAt"
    | "id"
    | "imageUrl"
    | "required"
    | "hideQuestionNumber"
  > {}

class GenericText
  extends Model<GenericTextModel, GenericTextModelCreationAttributes>
  implements GenericTextModel
{
  declare id: number;
  declare surveyId: number;
  declare label: string;
  declare description?: string;
  declare answerFormat: "text" | "regex";
  declare imageUrl?: string;
  declare required?: boolean;
  declare hideQuestionNumber?: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate() {}
}

GenericText.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    label: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    answerFormat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.TEXT,
    },
    required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    hideQuestionNumber: {
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
    tableName: "generic_text",
    timestamps: true,
  }
);

export default GenericText;
