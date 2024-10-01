import dotenv from "dotenv";

dotenv.config({ path: `${process.cwd()}/.env` });

import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../errors/customError";
import { ReturnedJWTPaylod } from "../types/types";

const secretKey = process.env.JWT_SECRET_KEY as string;
const expiresIn = process.env.JWT_EXPIERS_IN;

const generateToken = (payload: JwtPayload) => {
  try {
    console.log(secretKey);

    return jwt.sign(payload, secretKey, { expiresIn });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new CustomError("Error generating token", 400, true);
  }
};

const verifyToken = (token: string): ReturnedJWTPaylod => {
  try {
    return jwt.verify(token, secretKey) as ReturnedJWTPaylod;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new CustomError("Couldn't Validate Token", 400, true);
  }
};

export { generateToken, verifyToken };
