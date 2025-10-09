import bcrypt from "bcrypt";

export const hashPassword = async (password, saltRounds = process.env.BCRYPT_SALT_ROUNDS) => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const validatePasswordStrength = (password) => {
  // Password must be at least 8 characters long and include at least one uppercase, lowercase, and number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};