import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { UserGroupModel } from "../../types/types";

interface UserGroupModelCreationAttributes
  extends Optional<UserGroupModel, "createdAt" | "updatedAt"> {}

class UserGroup
  extends Model<UserGroupModel, UserGroupModelCreationAttributes>
  implements UserGroupModel
{
  declare userId: number;
  declare groupId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate() {}
}

// Initialize the model
UserGroup.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Group",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "user_group",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "groupId"],
        name: "unique_user_group",
      },
    ],
  }
);
export default UserGroup;
