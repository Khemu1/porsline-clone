import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { GeneralTextModel } from "../../types/types";

interface GeneralTextModelCreationAttributes
  extends Optional<GeneralTextModel, "createdAt" | "updatedAt" | "id"> {}

class GeneralText
  extends Model<GeneralTextModel, GeneralTextModelCreationAttributes>
  implements GeneralTextModel
{
  declare id: number;
  declare questionId: number;
  declare min: number;
  declare max: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate() {}
}

GeneralText.init(
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
    min: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
        isGreaterThanMax(value) {
          if (
            this.max !== null &&
            this.max !== undefined &&
            value >= this.max
          ) {
            throw new Error("min must be less than max");
          }
        },
      },
    },
    max: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
      allowNull: false,
      validate: {
        min: 0,
        isGreaterThanMin(value) {
          if (this.min && value <= this.min) {
            throw new Error("Max must be greater than Min");
          }
        },
        max: 1000,
      },
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
    tableName: "general_text",
    timestamps: true,
  }
);

export default GeneralText;
