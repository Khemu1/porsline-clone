import bcrypt from "bcrypt";
import User from "../db/models/User";
import { SafeUser, signInParams, SignUpParams } from "../types/types";
import { CustomError } from "../errors/customError";
import { Op } from "sequelize";

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    return newUser.omitFields(["password", "createdAt", "updatedAt"]);
  } catch (error) {
    throw error;
  }
};

const getUser = async ({
  usernameOrEmail,
  password,
}: signInParams): Promise<SafeUser> => {
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }],
      },
    });
    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      throw new CustomError("Invalid credentials", 401, true);
    }

    return existingUser.omitFields([
      "password",
      "createdAt",
      "updatedAt",
    ]);
  } catch (error) {
    throw error;
  }
};

export { addUser, getUser };
