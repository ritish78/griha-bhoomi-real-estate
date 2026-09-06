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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const propertyController_1 = require("src/controller/property/propertyController");
const propertySchema_1 = require("src/controller/property/propertySchema");
const authCheck_1 = require("src/middleware/authCheck");
const validateRequest_1 = require("src/middleware/validateRequest");
// import { Property } from "src/model/property";
const error_1 = require("src/utils/error");
const logger_1 = __importDefault(require("src/utils/logger"));
// import { dummyPropertyData } from "seed";
const config_1 = require("src/config");
const preparedStatement_1 = require("src/db/preparedStatement");
const bookmarkController_1 = require("src/controller/bookmark/bookmarkController");
const router = (0, express_1.Router)();
/**
 * @route       /api/v1/property/seed-property
 * @method      POST
 * @desc        Seed dummy property into postgresql db
 * @access      Auth User
 */
// router.route("/seed-property").post(onlyIfLoggedIn, async (req: Request, res: Response) => {
//   try {
//     await seedProperty(dummyPropertyData);
//     res.status(201).send({ message: "Property info seeded successfully!" });
//   } catch (error) {
//     console.log("Error while seeding the property to database!");
//     res.status(500).send({ message: "Could not seed property info to database!" });
//   }
// });
/**
 * @route               /api/v1/property/new
 * @method              POST
 * @desc                Add new property listing
 * @access              Auth User
 * @param title         String - Title of the listing of the property
 * @param description   String - Description of the property
 * @param toRent        Boolean - Is property for rent?
 * @param address       String - Current implementation is to put address as a whole but need to create address table and add address to it and refer the address id instead on here
 * @param closeLandmark String - Closest Landmark
 * @param propertyType  String - House | Land
 * @param availableFrom String - Date in string from when the property is for sale or rent
 * @param availableTill String - Date in string till the date where property is available
 * @param price         String - Price of the property
 * @param negotiable    Boolean - Is property negotiable
 * @param imageUrl      String[] - Array of image url
 * @param status        String - Sale | Hold | Sold
 * @param expiresOn     String - Date in string where the listing expires on the website
 * @returns             Response or NextFunction
 */
router
    .route("/new")
    .post(authCheck_1.onlyIfLoggedIn, (0, validateRequest_1.validateRequest)(propertySchema_1.newPropertySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    try {
        //In this below addProperty function, TypeScript throws error as userId
        //can be undefined. However that should not be the case as we already have
        //`onlyIfLoggedIn` middleware which will throw AuthError if userId is not present
        //The way to solve it could be to add `!` in the above line where we have;
        //const userId = req.session.userId!;
        //Howerver, let's add a if clause to check if userId isn't null or undefined
        //even if it should not be possible.
        if (!userId) {
            throw new error_1.AuthError("Could not verify the user! Please sign in to perfom this action!");
        }
        if (req.body.propertyType.toUpperCase() === "HOUSE") {
            //We validate if all the fields that we received in the body is of proper type for house
            (0, validateRequest_1.validatePropertySchema)(req.body, "HOUSE");
        }
        else if (req.body.propertyType.toUpperCase() === "LAND") {
            (0, validateRequest_1.validatePropertySchema)(req.body, "LAND");
        }
        else {
            next(new error_1.BadRequestError("Could not parse property type from the request body!"));
        }
        /**
         * There are three tables; Property, House and Land. Property is the main table which connects
         * to the other two tables House and Land. House and Land are the types of property. First, we
         * add House or Land info to the table. Then we get the id of the inserted row which we will
         * store in the Property table in the column; property_type_id.
         * Other way of doing it could be creating a row for the main table, Property, where we store
         * the property info and leave the column `property_type_id` to be null. And then store the
         * house or land info to their respective table and once we store it, we get their id and
         * update the recently inserted property and set the id that we received from house or land
         * table to the column property_type_id. It would make another database call which will lead
         * to performance issue once we start to have real users in the app
         */
        const idOfInsertedProperty = yield (0, propertyController_1.addProperty)(userId, req.body
        // expiresOn ? expiresOn : new Date()
        );
        return res.status(201).send({ message: `New Property added of id: ${idOfInsertedProperty}!` });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route       /api/v1/property
 * @eg          /api/v1/property?page=2&limit=12
 * @method      GET
 * @desc        Get properties for homepage and retrieving can be offset as well.
 * @access      Public
 */
router.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //First we get the number of page that we are in
    //If the user is in `localhost:5000/api/v1/property` we say that they are in first page
    //and limit the first 10 results. To get to the next page `?page=2` needs to be supplied
    const currentPageNumber = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || config_1.PROPERTY_COUNT_LIMIT_PER_PAGE;
    //Setting a guard rail just in case somebody sends in very high limit number
    if (limit <= 0 || limit > 20) {
        limit = config_1.PROPERTY_COUNT_LIMIT_PER_PAGE;
    }
    //We are doing a count of total number of properties in the table `Property` and
    //yes, I know it will lead to slow db performance if we have like 100 million rows
    //and since we don't have those kinds of rows count, we should be fine
    const numberOfProperties = yield preparedStatement_1.getTotalNumberOfProperties.execute();
    //In the scenario where there is no property, we were redirecting the user to page 1
    //and since, there is no property, we were causing a loop of redirect in our previous implementation
    if (numberOfProperties[0].count === 0) {
        return res.status(200).send({
            currentPageNumber: 1,
            numberOfPages: 1,
            properties: []
        });
    }
    const numberOfPages = Math.ceil(numberOfProperties[0].count / limit);
    //If the user tries to visit page number below 1 than the number
    //of pages in the website, we redirect them back to page 1
    if (currentPageNumber <= 0) {
        return res.redirect("/api/v1/property?page=1");
    }
    //If the user tires to visit page number more than number of pages
    //in the website, we redirect them to the last page number
    if (currentPageNumber > numberOfPages) {
        return res.redirect(`/api/v1/property?page=${numberOfPages}`);
    }
    //Then we get the list of properties according to the page that the user is in
    const properties = yield (0, propertyController_1.getListOfPropertiesByPagination)((currentPageNumber - 1) * limit, limit);
    return res.status(200).send({ currentPageNumber, numberOfPages, properties });
}));
/**
 * @route             /api/v1/property/featured
 * @eg                /api/v1/property/featured?page=1&limit=3
 * @method            GET
 * @desc              Retrieve list of properties if featured is set as true
 * @access            Public
 */
router.route("/featured").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //First we get the current page that the user is currently in.
    //If the user does not supply the page number then we provide the default
    //value of the page number to be 1
    const currentPageNumber = Number(req.query.page) || 1;
    //We also set the default value of limit to 3. In the homepage, we might need only
    //3 properties that are set as featured and we want just 3. And we might need
    //12 featured property when the user is on a dedicated featured page
    let limit = Number(req.query.limit) || 3;
    //If the user tries to visit page number below 1 than the number
    //of pages in the website, we redirect them back to page 1
    if (currentPageNumber <= 0) {
        return res.redirect("/api/v1/property/featured?page=1");
    }
    //We get the numberOfProperties from preparedStatement
    //We receive in this format: [ { count: 'n' } ]
    const numberOfProperties = yield preparedStatement_1.preparedGetTotalNumberOfFeaturedProperties.execute();
    //If we don't have any featured property in the database, then we return an empty array
    if (numberOfProperties[0].count === 0) {
        return res
            .status(200)
            .send({ currentPageNumber: 1, numberOfPages: 1, numberOfProperties: 0, limit, properties: [] });
    }
    //If the user submits the limit of less than 0 or greater than 12, then we set
    //the defauly value to 12 as someone might send very high number of limit count
    if (limit <= 0 || limit >= 12) {
        limit = 12;
    }
    const numberOfPages = Math.ceil(numberOfProperties[0].count / limit);
    //If the current page requested by the user is more than the pages in the provided
    //limit then we return the last page to the user.
    if (currentPageNumber > numberOfPages) {
        return res.redirect(`/api/v1/property/featured?page=${numberOfPages}`);
    }
    //Finally we fetch the list of featured propertties, with offset and limit applied
    const featuredProperties = yield (0, propertyController_1.getListOfFeaturedPropertiesByPagination)((currentPageNumber - 1) * limit, limit);
    return res.status(200).send({
        currentPageNumber,
        numberOfPages,
        properties: featuredProperties
    });
}));
/**
 * @route               /api/v1/property/filter?keyword=value
 * @eg                  /api/v1/property/filter?keyword=beach OR /api/v1/property?keyword=beach+traditional
 * @method              GET
 * @desc                Search property by title and/or description
 * @reqParams           string - propertyId
 * @access              Public
 */
router.route("/filter").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = req.query;
    console.log("The selected filters are: ", filters);
    logger_1.default.info(`Searched property using filters`, {
        filters,
        userId: req.session.userId,
        userEmail: req.session.email,
        ip: req.socket.remoteAddress
    }, true);
    const propertyList = yield (0, propertyController_1.filterProperties)(filters);
    //If the user does not provide any search query then the above function
    //returns -1. In that case, we can redirect the user to `/api/v1/property?page=1`
    if (propertyList === -1) {
        return res.redirect("/api/v1/property?page=1");
    }
    return res.status(200).send(propertyList);
}));
/**
 * @route               /api/v1/property/id/:propertyId
 * @method              GET
 * @desc                Get property using its id
 * @reqParams           string - propertyId
 * @access              Public
 */
router.route("/id/:propertyId").get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Property search by id", req.params.propertyId);
    const propertyById = yield (0, propertyController_1.getPropertyById)(req.params.propertyId, req.session.userId);
    if (!propertyById) {
        logger_1.default.notFound(`Property ID: ${req.params.propertyId} - (${new Date().toISOString()})`, {
            userId: req.session.userId,
            email: req.session.email,
            ip: req.socket.remoteAddress
        }, true);
        next(new error_1.NotFoundError(`Property of id ${req.params.propertyId} not found!`));
    }
    else {
        return res.status(200).send(propertyById);
    }
}));
/**
 * @route               /api/v1/property/:slug
 * @method              GET
 * @desc                Get property using its slug
 * @reqParams           string - slug
 * @access              Public
 */
router.route("/:slug").get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Property search by id", req.params.slug);
    const propertyBySlug = yield (0, propertyController_1.getPropertyBySlug)(req.params.slug, req.session.userId);
    if (!propertyBySlug) {
        logger_1.default.notFound(`Property slug: ${req.params.slug} - (${new Date().toISOString()})`, {
            userId: req.session.userId,
            email: req.session.email,
            ip: req.socket.remoteAddress
        }, true);
        next(new error_1.NotFoundError(`Property of slug ${req.params.slug} not found!`));
    }
    return res.status(200).send(propertyBySlug);
}));
/**
 * @route               /api/v1/property/id/:propertyId
 * @method              DELETE
 * @desc                Delete property using its id
 * @reqParams           string - propertyId
 * @access              Auth User | Admin
 */
router
    .route("/id/:propertyId")
    .delete(authCheck_1.onlyIfLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.session.userId;
    const propertyIdToBeDeleted = req.params.propertyId;
    console.log(propertyIdToBeDeleted);
    //Logging into the log file before making any changes
    logger_1.default.info(`Property deletion action started of id ${propertyIdToBeDeleted} by user of id ${currentUserId}`, { currentUserId, propertyIdToBeDeleted, useremail: req.session.email, ip: req.socket.remoteAddress });
    //currentUserId should exists as we have `onlyIfLoggedIn` middleware but TypeScript insists
    //that currentUserId can be undefined, so we can cast it to string to remove the error
    //but let's check if the id for the current user exists, just in case!
    if (!currentUserId) {
        throw new error_1.AuthError("User is not logged in! Login to perform this action!");
    }
    const deletedProperty = yield (0, propertyController_1.deletePropertyById)(currentUserId, propertyIdToBeDeleted);
    if (deletedProperty === 1) {
        return res.status(200).send({ message: "Property deleted successfully!" });
    }
    else if (deletedProperty === -1) {
        throw new error_1.ForbiddenError("User is not authorized to perform this action!");
    }
    else {
        logger_1.default.notFound(`Property to delete ID: ${req.params.propertyId} - (${new Date().toISOString()})`, {
            userId: req.session.userId,
            email: req.session.email,
            ip: req.socket.remoteAddress
        }, true);
        next(new error_1.NotFoundError("Property to delete does not exists!"));
    }
}));
/**
 * @route               /api/v1/property/id/:propertyId
 * @method              PUT
 * @desc                Update using its id
 * @reqParams           string - propertyId
 * @access              Private
 */
router
    .route("/id/:propertyId")
    .put(authCheck_1.onlyIfLoggedIn, (0, validateRequest_1.validateRequest)(propertySchema_1.updatePropertySchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const idOfPropertyToUpdate = req.params.propertyId;
    const currentUserId = req.session.userId;
    if (!currentUserId) {
        next(new error_1.AuthError("Please login to perform this action!"));
    }
    const updatedProperty = yield (0, propertyController_1.updatePropertyById)(idOfPropertyToUpdate, currentUserId, req.body);
    if (updatedProperty === 1) {
        logger_1.default.info(`Updated property of id ${idOfPropertyToUpdate} by user of id ${currentUserId}`, { idOfPropertyToUpdate, currentUserId, email: req.session.email, body: req.body }, true);
        return res
            .status(200)
            .send({ message: `Property of id ${idOfPropertyToUpdate} updated successfully!` });
    }
    else if (updatedProperty === -1) {
        next(new error_1.ForbiddenError("User is not allowed to perform this action!"));
    }
    else {
        next(new error_1.NotFoundError("Property to update does not exists!"));
    }
}));
/**
 * @route               /api/v1/property/id/:propertyId/private
 * @method              POST
 * @desc                Toggle the private status of the property
 * @reqParams           string - propertyId
 * @access              Private
 */
router
    .route("/id/:propertyId/private")
    .post(authCheck_1.onlyIfLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const idOfPropertyToTogglePrivate = req.params.propertyId;
    const currentUserId = req.session.userId;
    if (!currentUserId) {
        next(new error_1.AuthError("Please login to perform this action!"));
    }
    const privatePropertyToggled = yield (0, propertyController_1.togglePropertyPrivate)(idOfPropertyToTogglePrivate, currentUserId);
    if (privatePropertyToggled) {
        return res
            .status(200)
            .send({ message: `Updated private status of property of id ${idOfPropertyToTogglePrivate}` });
    }
    else {
        return res.status(404).send({ message: `Property of id ${idOfPropertyToTogglePrivate} not found!` });
    }
}));
/**
 * @route               /api/v1/property/id/:propertyId/bookmark
 * @method              POST
 * @desc                Toggle bookmark the property listing
 * @reqParams           string - propertyId
 * @access              Private
 */
router
    .route("/id/:propertyId/bookmark")
    .post(authCheck_1.onlyIfLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const idOfPropertyToBookmark = req.params.propertyId;
    const currentUserId = req.session.userId;
    if (!currentUserId) {
        next(new error_1.AuthError("Please login to perform this action!"));
    }
    const isBookmarked = yield (0, bookmarkController_1.toggleBookmark)(currentUserId, idOfPropertyToBookmark);
    if (isBookmarked == 1) {
        return res.status(201).send({ message: `Bookmarked property of id ${idOfPropertyToBookmark}` });
    }
    else if (isBookmarked === 0) {
        return res
            .status(200)
            .send({ message: `Bookmark deleted of property of id ${idOfPropertyToBookmark}` });
    }
    else {
        next(new error_1.NotFoundError("Property to bookmark does not exists!"));
    }
}));
exports.default = router;
