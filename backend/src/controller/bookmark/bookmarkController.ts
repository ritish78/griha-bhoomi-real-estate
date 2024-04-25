import {
  preparedInsertBookmark,
  preparedGetBookmark,
  preparedDeleteBookmark,
  preparedGetPropertyById,
  preparedAppendToBookmarkInUser,
  preparedDeleteBookmarkFromUser
} from "src/db/preparedStatement";
import { isAdmin } from "src/utils/isAdmin";

/**
 * @param userId        string - uuid of the user who bookmarked the property
 * @param propertyId    string - uuid of the property to bookmark
 * @returns             1 if bookmarked | 0 if bookmark exists
 */
const addBookmark = async (userId: string, propertyId: string) => {
  await preparedInsertBookmark.execute({ userId, propertyId });
  return 1;
};

/**
 * @param userId        string - uuid of the user who bookmarked the property
 * @param propertyId    string - uuid of the property to bookmark
 * @returns             true if bookmark exists | false if bookmark does notexists
 */
export const checkIfBookmarkExists = async (userId: string, propertyId: string) => {
  const [bookmark] = await preparedGetBookmark.execute({ userId, propertyId });

  return bookmark ? true : false;
};

/**
 * @param userId        string - uuid of the user who bookmarked the property
 * @param propertyId    string - uuid of the property to bookmark
 * @returns             true if bookmark exists | false if bookmark does notexists
 */
const deleteBookmark = async (userId: string, propertyId: string) => {
  await preparedDeleteBookmark.execute({ userId, propertyId });
  return 1;
};

/**
 * @param userId        string - uuid of the user who bookmarked the property
 * @param propertyId    string - uuid of the property to bookmark
 * @returns             true if user can bookmark | false if user can not bookmark
 */
const checkIfCurrentUserCanBookmark = async (userId: string, propertyId: string) => {
  const [propertyById] = await preparedGetPropertyById.execute({ propertyId });

  //If property does not exists or userId does not exists, user can not bookmark it
  if (!propertyById || !userId) {
    return false;
  }

  //If the property isn't set to private and the listing hasn't expired yet
  //the user can bookmark it. So, we return `true`.
  if (!propertyById.private && new Date(propertyById.expiresOn) > new Date()) {
    return true;
  }

  //More checks to see if the property is private or is the listing past expiration
  if (propertyById.private || new Date(propertyById.expiresOn) < new Date()) {
    //If the property listing is of current user, the user can bookmark it
    if (propertyById.sellerId === userId) {
      return true;
    }
    //If the current user is an admin, the user can bookmark it
    const currentUserIsAdmin = await isAdmin(userId);
    if (currentUserIsAdmin) {
      return true;
    } else {
      return false;
    }
  }

  return false;
};

/**
 * @param userId        string - uuid of the user who intends to bookmark the property
 * @param propertyId    string - uuid of the property to bookmark
 * @returns             -1 | 0 | 1 - -1 if user can not bookmark the proerty, 0 if bookmark deleted and 1 if bookmarked
 */
export const toggleBookmark = async (userId: string, propertyId: string) => {
  const bookmarkExists = await checkIfBookmarkExists(userId, propertyId);
  const userCanBookmarkProperty = await checkIfCurrentUserCanBookmark(userId, propertyId);

  if (userCanBookmarkProperty) {
    if (!bookmarkExists) {
      await addBookmark(userId, propertyId);
      //Now inserting the property id in the array of user row
      await preparedAppendToBookmarkInUser.execute({ userId, propertyId });
      return 1;
    } else {
      await deleteBookmark(userId, propertyId);
      //Now removing the property id from the array in user row
      await preparedDeleteBookmarkFromUser.execute({ userId, propertyId });
      return 0;
    }
  } else {
    return -1;
  }
};
