import { preparedGetUserById } from "src/db/preparedStatement";

export const isAdmin = async (userId: string) => {
  const [userById] = await preparedGetUserById.execute({ userId });

  return userById.isAdmin || userById.role === "ADMIN" || userById.role === "MODERATOR";
};
