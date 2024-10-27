import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { GroupMemberModel, UserGroupModel } from "../../types/types";

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
  declare username: string;
  declare groupName: string;

  // Adding a members field to keep track of group members
  declare members?: GroupMemberModel[]; // Optional field for members

  static associate(models: any) {
    UserGroup.belongsTo(models.User, { foreignKey: "userId" });
    UserGroup.belongsTo(models.Group, { foreignKey: "groupId" });
  }
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "userGroup",
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
