import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { SafeUser, UserModel } from "../../types/types";
import WorkSpace from "./WorkSpace";
import Survey from "./Survey";
import Group from "./Group";
import UserGroup from "./UserGroup";
import WelcomePart from "./WelcomePart";
import GenericText from "./GenericText";
import GeneralText from "./GeneralText";
import GeneralRegex from "./GeneralRegex";

interface UserModelCreationAttributes
  extends Optional<
    UserModel,
    "id" | "createdAt" | "updatedAt" | "workspaces" | "UserGroups"
  > {}

class User
  extends Model<UserModel, UserModelCreationAttributes>
  implements UserModel
{
  declare id: number; // Type declaration
  declare username: string;
  declare password: string;
  declare groupId: number; // Group created by this user
  declare createdAt: Date;
  declare updatedAt: Date;

  public omitFields(fieldsToOmit: Array<keyof User>): SafeUser {
    const userObject = { ...this.get() } as Record<string, any>;

    fieldsToOmit.forEach((field) => {
      if (field in userObject) {
        delete userObject[field];
      }
    });
    return userObject as SafeUser;
  }

  static associate() {
    // User to WorkSpace
    User.hasMany(WorkSpace, { foreignKey: "maker" });
    WorkSpace.belongsTo(User, { foreignKey: "maker" });

    // WorkSpace to Survey
    WorkSpace.hasMany(Survey, { foreignKey: "workspace", as: "surveys" });
    Survey.belongsTo(WorkSpace, { foreignKey: "workspace" });

    // User to Group (created by the user)
    User.hasOne(Group, { foreignKey: "maker" }); // A user can create only one group
    Group.belongsTo(User, { foreignKey: "maker" }); // A group has one creator (user)

    // Group to UserGroup
    Group.hasMany(UserGroup, { foreignKey: "groupId" }); // Group can have many user memberships
    UserGroup.belongsTo(Group, { foreignKey: "groupId" }); // UserGroup belongs to one group

    // User to UserGroup
    User.hasMany(UserGroup, { foreignKey: "userId" }); // User can join multiple groups through UserGroup
    UserGroup.belongsTo(User, { foreignKey: "userId" }); // UserGroup belongs to one user

    WelcomePart.belongsTo(Survey, {
      foreignKey: "surveyId",
    });
    Survey.hasMany(WelcomePart, { foreignKey: "surveyId", as: "welcomePart" });

    GenericText.hasMany(GeneralText, {
      foreignKey: "questionId",
      as: "generalTexts",
    });

    GeneralText.belongsTo(GenericText, { foreignKey: "questionId" });

    GenericText.hasMany(GeneralRegex, {
      foreignKey: "questionId",
      as: "generalRegexes",
    });
    GeneralRegex.belongsTo(GenericText, { foreignKey: "questionId" });

    Survey.hasMany(GenericText, { foreignKey: "surveyId", as: "genericTexts" });
    GenericText.belongsTo(Survey, { foreignKey: "surveyId" });
  }
}

// Initialize the model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null if the user hasn't created a group yet
      references: {
        model: "group",
        key: "id",
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Username is required" },
        notNull: { msg: "Username cannot be null" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password is required" },
        notNull: { msg: "Password cannot be null" },
        len: {
          args: [8, 100],
          msg: "Password must be between 8 and 100 characters long",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "user",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
    ],
  }
);

export default User;
