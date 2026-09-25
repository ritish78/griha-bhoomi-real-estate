import { eq, sql } from "drizzle-orm";
import db from "src/db";
import {
  preparedDeleteAddress,
  preparedGetAddressById,
  preparedGetPropertyById,
  preparedInsertAddress
} from "src/db/preparedStatement";
import { address } from "src/model/address";
import { Property } from "src/model/property";
import { ForbiddenError, NotFoundError } from "src/utils/error";
import logger from "src/utils/logger";
import { v4 as uuidv4 } from "uuid";
import { getPropertyBySlug } from "../property/propertyController";
import { isAdmin } from "src/utils/isAdmin";
import { newAddressSchema, updateAddressSchema } from "./addressSchema";
import { PgUpdateSetSource } from "drizzle-orm/pg-core";

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
  //We also validate here so callers outside the property controller
  //cannot insert an address without its location.
  newAddressSchema.parse({
    body: {
      houseNumber,
      street,
      wardNumber,
      municipality,
      city,
      district,
      province,
      latitude,
      longitude
    }
  });

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
export const updateAddressById = async (
  propertyId: string,
  addressId: string,
  updateFields: any,
  database: Pick<typeof db, "update"> = db
) => {
  logger.info(`Updating address of id: ${addressId}`);

  //just to be sure that fields are correct before updating
  updateFields = updateAddressSchema.parse({
    body: updateFields
  }).body;

  //Destructuring the update fields of address from req.body that was passed from api handler
  const { houseNumber, street, wardNumber, municipality, city, district, province, latitude, longitude } =
    updateFields;

  //Then let's check if the address belongs to the property
  const [propertyById] = await preparedGetPropertyById.execute({ propertyId });

  if (!propertyById || propertyById.address !== addressId) {
    throw new NotFoundError("Property to update does not exists!");
  }

  const location =
    latitude === undefined
      ? undefined
      : sql`
        ST_SetSRID(
          ST_MakePoint(${longitude}::real, ${latitude}::real),
          4326
        )
      `;

  //it was Partial<Property> before but now using PgUpdateSetSource<typeof address>
  const addressFieldsToUpdate: PgUpdateSetSource<typeof address> = {};
  addressFieldsToUpdate.updatedAt = new Date();

  if (houseNumber !== undefined) {
    addressFieldsToUpdate.houseNumber = houseNumber;
  }

  if (wardNumber !== undefined) {
    addressFieldsToUpdate.wardNumber = wardNumber;
  }

  //Zero is a valid coordinate. Omitted coordinates keep the saved location.
  if (latitude !== undefined) {
    addressFieldsToUpdate.latitude = latitude;
  }

  if (longitude !== undefined) {
    addressFieldsToUpdate.longitude = longitude;
  }

  if (location !== undefined) {
    addressFieldsToUpdate.location = location;
  }

  await database.update(address).set(addressFieldsToUpdate).where(eq(address.id, addressId));

  logger.info(`Updating address of id: ${addressId}`, addressFieldsToUpdate, true);
};

/**
 * @param addressId       string - uuid of the address to fetch
 */
export const getAddressById = async (addressId: string) => {
  const addressById = await preparedGetAddressById.execute({ addressId });

  if (!addressById || addressById.length === 0) {
    throw new NotFoundError("Address not found!");
  }

  return addressById[0];
};
