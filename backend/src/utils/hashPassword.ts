import bcrypt from "bcrypt";

/**
 * @param plainPassword   string: plain password to hash
 * @param saltRounds      number: salt rounds, default = 10
 * @returns               string: hashed password using bcrypt
 */
const hashPassword = async (plainPassword: string, saltRounds = 10) => {
  //We use bcrypt to hash the password
  //Salt Rounds is the cost factor to calculate a single bcrypt hash
  //More salt rounds require more processing power and provide more security
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  return hashedPassword;
};

export default hashPassword;
