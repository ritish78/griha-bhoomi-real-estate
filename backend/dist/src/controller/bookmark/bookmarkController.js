"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBookmark = exports.checkIfBookmarkExists = void 0;
const preparedStatement_1 = require("src/db/preparedStatement");
const isAdmin_1 = require("src/utils/isAdmin");
/**
 * @param userId        string - uuid of the user who bookmarked the property
 * @param propertyId    string - uuid of the property to bookmark
 * @returns             1 if bookmarked | 0 if bookmark exists
 */
const addBookmark = (userId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    yield preparedStatement_1.preparedInsertBookmark.execute({ userId, propertyId });
    return 1;
});
/**
 * @param userId        string - uuid of the user who bookmarked the property
 * @param propertyId    string - uuid of the property to bookmark
 * @returns             true if bookmark exists | false if bookmark does notexists
 */
const checkIfBookmarkExists = (userId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    const [bookmark] = yield preparedStatement_1.preparedGetBookmark.execute({ userId, propertyId });
    return bookmark ? true : false;
});
exports.checkIfBookmarkExists = checkIfBookmarkExists;
/**
 * @param userId        string - uuid of the user who bookmarked the property
 * @param propertyId    string - uuid of the property to bookmark
 * @returns             true if bookmark exists | false if bookmark does notexists
 */
const deleteBookmark = (userId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    yield preparedStatement_1.preparedDeleteBookmark.execute({ userId, propertyId });
    return 1;
});
/**
 * @param userId        string - uuid of the user who bookmarked the property
 * @param propertyId    string - uuid of the property to bookmark
 * @returns             true if user can bookmark | false if user can not bookmark
 */
const checkIfCurrentUserCanBookmark = (userId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    const [propertyById] = yield preparedStatement_1.preparedGetPropertyById.execute({ propertyId });
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
        const currentUserIsAdmin = yield (0, isAdmin_1.isAdmin)(userId);
        if (currentUserIsAdmin) {
            return true;
        }
        else {
            return false;
        }
    }
    return false;
});
/**
 * @param userId        string - uuid of the user who intends to bookmark the property
 * @param propertyId    string - uuid of the property to bookmark
 * @returns             -1 | 0 | 1 - -1 if user can not bookmark the proerty, 0 if bookmark deleted and 1 if bookmarked
 */
const toggleBookmark = (userId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmarkExists = yield (0, exports.checkIfBookmarkExists)(userId, propertyId);
    const userCanBookmarkProperty = yield checkIfCurrentUserCanBookmark(userId, propertyId);
    if (userCanBookmarkProperty) {
        if (!bookmarkExists) {
            yield addBookmark(userId, propertyId);
            //Now inserting the property id in the array of user row
            yield preparedStatement_1.preparedAppendToBookmarkInUser.execute({ userId, propertyId });
            return 1;
        }
        else {
            yield deleteBookmark(userId, propertyId);
            //Now removing the property id from the array in user row
            yield preparedStatement_1.preparedDeleteBookmarkFromUser.execute({ userId, propertyId });
            return 0;
        }
    }
    else {
        return -1;
    }
});
exports.toggleBookmark = toggleBookmark;
