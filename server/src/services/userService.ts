import User from "../db/models/User";
import { SafeUser, signInParams, SignUpParams } from "../types/types";
import { CustomError } from "../errors/customError";
import { Op } from "sequelize";
import UserGroup from "../db/models/UserGroup";
import Group from "../db/models/Group";
import { getTranslation } from "../utils";

const addUser = async ({
  username,
  password,
  currentLang,
}: SignUpParams): Promise<SafeUser> => {
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: username }],
      },
    });

    if (existingUser) {
      throw new CustomError(
        getTranslation(currentLang, "usernameIsTaken"),
        400,
        true
      );
    }

    const user = User.build({
      username,
      password,
    });
    await user.validate();

    const newUser = await User.create(user);
    return newUser.omitFields(["password", "createdAt", "updatedAt"]);
  } catch (error) {
    throw error;
  }
};

const signInService = async ({
  username,
  password,
  currentLang,
}: signInParams): Promise<SafeUser> => {
  try {
    const existingUser = await User.findOne({
      where: {
        username: username,
      },
      include: [
        {
          model: UserGroup,
          as: "userGroups",
        },
        {
          model: Group,
          as: "createdGroup",
        },
      ],
    });
    const notFoundMessage = getTranslation(currentLang, "invalidCredentials");

    if (!existingUser || password !== existingUser.password) {
      throw new CustomError(notFoundMessage, 401, true);
    }

    return existingUser.omitFields(["password", "createdAt", "updatedAt"]);
  } catch (error) {
    throw error;
  }
};

const getUserService = async (userId: number) => {
  try {
    const userData = await User.findByPk(userId, {
      include: [
        // get user group
        // get user group members
        {
          model: Group,
          as: "createdGroup",
          attributes: ["id", "name"],
          include: [
            {
              model: UserGroup,
              as: "members",
              where: { [Op.not]: { userId: userId } },
            },
          ],
        },
      ],
    });

    const groupsUserIn = await UserGroup.findAll({ where: { userId: userId } });
    console.log(userData, groupsUserIn);
    return { userData, groupsUserIn };
  } catch (error) {
    throw error;
  }
};

export { addUser, signInService, getUserService };
