import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/database";
import { SafeUser, UserModel } from "../../types/types";
import WorkSpace from "./WorkSpace";
import Survey from "./Survey";
import Group from "./Group";
import UserGroup from "./UserGroup";

interface UserModelCreationAttributes
  extends Optional<UserModel, "id" | "createdAt" | "updatedAt"> {}

class User
  extends Model<UserModel, UserModelCreationAttributes>
  implements UserModel
{
  /**
   *The “declare” keyword informs the TypeScript compiler that a variable or method exists in another file (typically a JavaScript file).
    It’s similar to an “import” statement but doesn’t import anything; instead, it provides type information.
   */
  declare id: number; // Type declaration, not a public field
  declare username: string;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  /**
   * this method omits the given fields that are given in the array using the Omit Utility Type
   * the array must contain the keys of the User class
   * @param fieldsToOmit
   * @returns {SafeUser}
   */
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
    // user to workspace
    User.hasMany(WorkSpace, { foreignKey: "maker" });
    WorkSpace.belongsTo(User, { foreignKey: "maker" });
    // workspace to survey
    WorkSpace.hasMany(Survey, { foreignKey: "workspace" });
    Survey.belongsTo(WorkSpace, { foreignKey: "workspace" });
    //group to usergroup
    Group.hasMany(UserGroup, { foreignKey: "groupId" });
    UserGroup.belongsTo(Group, { foreignKey: "groupId" });
    // user to usergroup
    User.hasMany(UserGroup, { foreignKey: "userId" });
    UserGroup.belongsTo(User, { foreignKey: "userId" });
    //  User (creator) to Group
    User.hasMany(Group, { foreignKey: "creatorId" }); // User is the creator of many groups
    Group.belongsTo(User, { foreignKey: "creatorId", as: "creator" }); // A group belongs to one creator (User)
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Username is required",
        },
        notNull: {
          msg: "Username cannot be null",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required",
        },
        notNull: {
          msg: "Password cannot be null",
        },
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
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
    ],
  }
);
export default User;
