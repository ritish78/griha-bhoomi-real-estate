import { preparedInsertAddress } from "src/db/preparedStatement";
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
