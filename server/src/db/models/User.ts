import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";
import { RolesProps, SafeUser } from "../../types/types";

// Model definition
class User extends Model {
  /**
   *The “declare” keyword informs the TypeScript compiler that a variable or method exists in another file (typically a JavaScript file).
    It’s similar to an “import” statement but doesn’t import anything; instead, it provides type information.
   */
  declare id: number; // Type declaration, not a public field
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: RolesProps;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "user",
    timestamps: true,
    paranoid: true, // Enable soft delete
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
    ],
  }
);
export default User;
