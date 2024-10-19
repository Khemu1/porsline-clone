import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { WelcomePartModel } from "../../types/types";

interface WelcomePartModelCreationAttributes
  extends Optional<WelcomePartModel, "createdAt" | "updatedAt" | "id"> {}

class WelcomePart
  extends Model<WelcomePartModel, WelcomePartModelCreationAttributes>
  implements WelcomePartModel
{
  declare id: number;
  declare surveyId: number;
  declare label: string;
  declare description?: string;
  declare buttonText?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static associate() {}
}

WelcomePart.init(
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
    imageUrl: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    buttonText: {
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
    tableName: "welcome_part",
    timestamps: true,
  }
);

export default WelcomePart;
