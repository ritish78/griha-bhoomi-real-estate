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
exports.updateAddressById = exports.deleteAddress = exports.addAddress = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("src/db"));
const preparedStatement_1 = require("src/db/preparedStatement");
const address_1 = require("src/model/address");
const error_1 = require("src/utils/error");
const logger_1 = __importDefault(require("src/utils/logger"));
const uuid_1 = require("uuid");
/**
 * @param houseNumber       string - house number
 * @param street            string - name of the street
 * @param wardNumber        number - ward number
 * @param municipality      string - name of the municipality
 * @param city              string - name of the city
 * @param district          string - name of the district
 * @param province          string - name of the province
 * @param latitude          number - latitude
 * @param longitude         number - longitude
 */
const addAddress = (houseNumber, street, wardNumber, municipality, city, district, province, latitude, longitude) => __awaiter(void 0, void 0, void 0, function* () {
    const idOfToBeInsertedAddress = (0, uuid_1.v4)();
    yield preparedStatement_1.preparedInsertAddress.execute({
        id: idOfToBeInsertedAddress,
        houseNumber,
        street,
        wardNumber,
        municipality,
        city,
        district,
        province,
        latitude,
        longitude
    });
    return idOfToBeInsertedAddress;
});
exports.addAddress = addAddress;
/**
 * @param addressId     string - uuid of the address to delete
 */
const deleteAddress = (addressId) => __awaiter(void 0, void 0, void 0, function* () {
    yield preparedStatement_1.preparedDeleteAddress.execute({ addressId });
});
exports.deleteAddress = deleteAddress;
/**
 * @param propertyId        string - uuid of the property's address to update
 * @param addressId         string - uuid of the address to update
 * @info All of the params below are in `updateField` that we receive from request body
 * @param houseNumber       string - house number of the address
 * @param street            string - the name of street where the property is located
 * @param wardNumber        number - ward number
 * @param municipality      string - name of municiplaity
 * @param city              string - name of the city
 * @param district          string - name of the district
 * @param province          string - name of the province
 * @param latitude          number(float) - latitude of the property
 * @param longitude         number(float) - longitude of the property
 */
const updateAddressById = (propertyId, addressId, updateFields) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Updating address of id: ${addressId}`);
    //Destructuring the update fields of address from req.body that was passed from api handler
    const { houseNumber, street, wardNumber, municipality, city, district, province, latitude, longitude } = updateFields;
    //Then let's check if the address belongs to the property
    const [propertyById] = yield preparedStatement_1.preparedGetPropertyById.execute({ propertyId });
    if (!propertyById || propertyById.address !== addressId) {
        throw new error_1.NotFoundError("Property to update does not exists!");
    }
    const addressFieldsToUpdate = {};
    addressFieldsToUpdate.updatedAt = new Date();
    if (houseNumber)
        addressFieldsToUpdate.houseNumber = houseNumber;
    if (street)
        addressFieldsToUpdate.street = street;
    if (wardNumber)
        addressFieldsToUpdate.wardNumber = wardNumber;
    if (municipality)
        addressFieldsToUpdate.municipality = municipality;
    if (city)
        addressFieldsToUpdate.city = city;
    if (district)
        addressFieldsToUpdate.district = district;
    if (province)
        addressFieldsToUpdate.province = province;
    if (latitude)
        addressFieldsToUpdate.latitude = latitude;
    if (longitude)
        addressFieldsToUpdate.longitude = longitude;
    yield db_1.default.update(address_1.address).set(addressFieldsToUpdate).where((0, drizzle_orm_1.eq)(address_1.address.id, addressId));
    logger_1.default.info(`Updating address of id: ${addressId}`, addressFieldsToUpdate, true);
});
exports.updateAddressById = updateAddressById;
