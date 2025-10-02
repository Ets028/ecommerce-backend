import { prisma } from "../config/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUser = async (userData) => {
  const { name, email, password, role = "user" } = userData;
  const hashedPassword = await hashPassword(password);
  
  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });
};

export const validatePassword = async (password, hashedPassword) => {
  return await comparePassword(password, hashedPassword);
};