import bcrypt from "bcrypt";
import User from "../db/models/User";
import { SafeUser, signInParams, SignUpParams } from "../types/types";
import { CustomError } from "../errors/customError";
import { Op } from "sequelize";

const addUser = async ({
  username,
  email,
  password,
  role,
}: SignUpParams): Promise<SafeUser> => {
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      throw new CustomError("Username or email already exists.", 400, true);
    }
   // made an instance of User to use it for validation before insertion
    const user = User.build({
      username,
      email,
      password: password,
      role: role,
    });
    await user.validate();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role,
    });
    return newUser.omitFields([
      "password",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ]);
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
        [Op.or]: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
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
      "deletedAt",
    ]);
  } catch (error) {
    throw error;
  }
};

export { addUser, getUser };
