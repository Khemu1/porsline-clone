import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { SurveyModel } from "../../types/types";

interface SurveyModelCreationAttributes
  extends Optional<SurveyModel, "active" | "id" | "createdAt" | "updatedAt"> {}

class Survey
  extends Model<SurveyModel, SurveyModelCreationAttributes>
  implements SurveyModel
{
  declare id: number;
  declare title: string;
  declare active: boolean;
  declare workspace: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate() {}
}

// Initialize the model
Survey.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
        len: {
          args: [1, 255],
          msg: "Title must be between 1 and 255 characters long",
        },
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Workspace ID cannot be null",
        },
      },
    },
    workspace: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "workspace",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "survey",
    timestamps: true,
    paranoid: true,
  }
);
export default Survey;
