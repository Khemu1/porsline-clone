import bcrypt from "bcrypt";
import User from "../db/models/User";
import { SafeUser, signInParams, SignUpParams } from "../types/types";
import { CustomError } from "../errors/customError";
import { Op } from "sequelize";
import UserGroup from "../db/models/UserGroup";
import Group from "../db/models/Group";

const addUser = async ({
  username,
  password,
}: SignUpParams): Promise<SafeUser> => {
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: username }],
      },
    });

    if (existingUser) {
      throw new CustomError("Username  already exists.", 400, true);
    }
    // made an instance of User to use it for validation before insertion
    const user = User.build({
      username,
      password: password,
    });
    await user.validate();

    const newUser = await User.create({
      username,
      password,
    });
    return newUser.omitFields(["password", "createdAt", "updatedAt"]);
  } catch (error) {
    throw error;
  }
};

const getUser = async ({
  username,
  password,
}: signInParams): Promise<SafeUser> => {
  try {
    const existingUser = await User.findOne({
      where: {
        username: username,
      },
      include: [
        {
          model: UserGroup,
          as: "groups",
        },
        {
          model: Group,
          as: "userGroup",
        },
      ],
    });
    if (!existingUser || password !== existingUser.password) {
      throw new CustomError("Invalid credentials", 401, true);
    }

    return existingUser.omitFields(["password", "createdAt", "updatedAt"]);
  } catch (error) {
    console.log("failed to find user :", error);
    throw error;
  }

};

export { addUser, getUser };
