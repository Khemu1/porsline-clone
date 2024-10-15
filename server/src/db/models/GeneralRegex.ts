import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";

import { GeneralRegexModel } from "../../types/types";

interface GeneralRegexCreationAttributes
  extends Optional<
    GeneralRegexModel,
    "createdAt" | "updatedAt" | "id" | "regexPlaceHolder"
  > {}
class GeneralRegex
  extends Model<GeneralRegexModel, GeneralRegexCreationAttributes>
  implements GeneralRegexModel
{
  declare id: number;
  declare questionId: number;
  declare regex: string;
  declare regexErrorMessage: string;
  declare regexPlaceHolder?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate() {}
}

GeneralRegex.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "generic_text",
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
    regex: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    regexErrorMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    regexPlaceHolder: {
      type: DataTypes.TEXT,
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
    tableName: "general_regex",
    timestamps: true,
  }
);

export default GeneralRegex;
