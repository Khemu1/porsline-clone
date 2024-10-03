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

UserGroup.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // This field is a primary key
      references: {
        model: "user",
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
    groupId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // This field is also a primary key
      references: {
        model: "group",
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "user_group",
    timestamps: true,
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
