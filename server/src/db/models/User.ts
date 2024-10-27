import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import {
  GroupModel,
  SafeUser,
  UserGroupModel,
  UserModel,
  WorkSpaceModel,
} from "../../types/types";
import WorkSpace from "./WorkSpace";
import Survey from "./Survey";
import Group from "./Group";
import UserGroup from "./UserGroup";
import WelcomePart from "./WelcomePart";
import GenericText from "./GenericText";
import GeneralText from "./GeneralText";
import GeneralRegex from "./GeneralRegex";
import DefaultEnding from "./DefaultEnding";
import CustomEnding from "./CustomEnding";

interface UserModelCreationAttributes
  extends Optional<
    UserModel,
    "id" | "createdAt" | "updatedAt" | "createdGroup"
  > {}

class User
  extends Model<UserModel, UserModelCreationAttributes>
  implements UserModel
{
  declare id: number;
  declare username: string;
  declare password: string;
  declare groupId: number;
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
    // User to Workspace
    User.hasMany(WorkSpace, { foreignKey: "maker" });
    WorkSpace.belongsTo(User, { foreignKey: "maker" });

    // WorkSpace to Survey
    WorkSpace.hasMany(Survey, { foreignKey: "workspace", as: "surveys" });
    Survey.belongsTo(WorkSpace, { foreignKey: "workspace" });

    // User to Group (created by the user)
    User.hasOne(Group, { foreignKey: "maker", as: "createdGroup" });
    Group.belongsTo(User, { foreignKey: "maker", as: "makerUser" });

    // Group to UserGroup
    Group.hasMany(UserGroup, { foreignKey: "groupId", as: "members" });
    UserGroup.belongsTo(Group, { foreignKey: "groupId", as: "group" });

    // User to UserGroup
    User.hasMany(UserGroup, { as: "userGroups", foreignKey: "userId" });
    UserGroup.belongsTo(User, { foreignKey: "userId", as: "groupMember" });

    // Other Associations
    WelcomePart.belongsTo(Survey, {
      foreignKey: "surveyId",
    });
    Survey.hasMany(WelcomePart, { foreignKey: "surveyId", as: "welcomeParts" });

    GenericText.belongsTo(Survey, { foreignKey: "surveyId" });
    Survey.hasMany(GenericText, { foreignKey: "surveyId", as: "questions" });

    Survey.hasMany(DefaultEnding, {
      foreignKey: "surveyId",
      as: "defaultEndings",
    });
    DefaultEnding.belongsTo(Survey, { foreignKey: "surveyId" });

    Survey.hasMany(CustomEnding, {
      foreignKey: "surveyId",
      as: "customEndings",
    });
    CustomEnding.belongsTo(Survey, { foreignKey: "surveyId" });

    GenericText.hasOne(GeneralText, {
      foreignKey: "questionId",
      as: "generalText",
    });
    GeneralText.belongsTo(GenericText, {
      foreignKey: "questionId",
    });

    GenericText.hasOne(GeneralRegex, {
      foreignKey: "questionId",
      as: "generalRegex",
    });
    GeneralRegex.belongsTo(GenericText, {
      foreignKey: "questionId",
    });
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
