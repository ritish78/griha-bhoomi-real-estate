import { preparedGetUserById } from "src/db/preparedStatement";

/**
 * @param userId  string - id of the user to verify if the user is admin or not
 * @returns       boolean - true if the user is an ADMIN or MODERATOR
 */
export const isAdmin = async (userId: string) => {
  const [userById] = await preparedGetUserById.execute({ userId });

  return userById.isAdmin || userById.role === "ADMIN" || userById.role === "MODERATOR";
};
