import { eq } from "drizzle-orm";
import db from "src/db";
import {
  preparedDeleteAddress,
  preparedGetPropertyById,
  preparedInsertAddress
} from "src/db/preparedStatement";
import { address } from "src/model/address";
import { Property } from "src/model/property";
import { NotFoundError } from "src/utils/error";
import logger from "src/utils/logger";
import { v4 as uuidv4 } from "uuid";

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
export const addAddress = async (
  houseNumber: string,
  street: string,
  wardNumber: number,
  municipality: string,
  city: string,
  district: string,
  province: string,
  latitude: number,
  longitude: number
) => {
  const idOfToBeInsertedAddress = uuidv4();

  await preparedInsertAddress.execute({
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
};

/**
 * @param addressId     string - uuid of the address to delete
 */
export const deleteAddress = async (addressId: string) => {
  await preparedDeleteAddress.execute({ addressId });
};

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
export const updateAddressById = async (propertyId: string, addressId: string, updateFields) => {
  logger.info(`Updating address of id: ${addressId}`);

  //Destructuring the update fields of address from req.body that was passed from api handler
  const { houseNumber, street, wardNumber, municipality, city, district, province, latitude, longitude } =
    updateFields;

  //Then let's check if the address belongs to the property
  const [propertyById] = await preparedGetPropertyById.execute({ propertyId });

  if (!propertyById || propertyById.address !== addressId) {
    throw new NotFoundError("Property to update does not exists!");
  }

  const addressFieldsToUpdate: Partial<Property> = {};
  addressFieldsToUpdate.updatedAt = new Date();

  if (houseNumber) addressFieldsToUpdate.houseNumber = houseNumber;
  if (street) addressFieldsToUpdate.street = street;
  if (wardNumber) addressFieldsToUpdate.wardNumber = wardNumber;
  if (municipality) addressFieldsToUpdate.municipality = municipality;
  if (city) addressFieldsToUpdate.city = city;
  if (district) addressFieldsToUpdate.district = district;
  if (province) addressFieldsToUpdate.province = province;
  if (latitude) addressFieldsToUpdate.latitude = latitude;
  if (longitude) addressFieldsToUpdate.longitude = longitude;

  await db.update(address).set(addressFieldsToUpdate).where(eq(address.id, addressId));

  logger.info(`Updating address of id: ${addressId}`, addressFieldsToUpdate, true);
};
