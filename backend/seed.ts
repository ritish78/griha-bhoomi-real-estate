import bcrypt from "bcryptjs";
import slugify from "slugify";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import db from "./src/db";
import { address } from "./src/model/address";
import { house } from "./src/model/house";
import { property } from "./src/model/property";
import { user } from "./src/model/user";
import { NUMBER_OF_SALT_ROUNDS } from "./src/config";

type PropertySeed = {
  sellerEmail: string;
  title: string;
  description: string;
  toRent: boolean;
  closeLandmark: string;
  availableFrom: string;
  availableTill: string;
  price: number;
  negotiable: boolean;
  imageUrl: string[];
  status: "Sale" | "Rent";
  expiresOn: string;
  houseNumber: string;
  street: string;
  wardNumber: number;
  municipality: string;
  city: string;
  district: string;
  province: string;
  latitude: number;
  longitude: number;

  houseType: "House" | "Flat" | "Shared" | "Room" | "Apartment" | "Bungalow" | "Villa";
  roomCount: number;
  floorCount: number;
  kitchenCount: number;
  sharedBathroom: boolean;
  bathroomCount: number;
  facilities: string[];
  area: string;
  furnished: boolean;
  facing: string;
  carParking: number;
  bikeParking: number;
  evCharging: boolean;
  builtAt: string;
  connectedToRoad: boolean;
  distanceToRoad: number;
};

const seedUsers = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@email.com",
    password: "password123",
    phone: "9800000001",
    dob: "1990-01-15"
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "janesmith@email.com",
    password: "password123",
    phone: "9800000002",
    dob: "1988-07-22"
  },
  {
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aaravsharma@email.com",
    password: "password123",
    phone: "9800000003",
    dob: "1995-03-05"
  }
];

export const seedProperties: PropertySeed[] = [
  {
    sellerEmail: "johndoe@email.com",
    title: "Luxury Villa in Kathmandu",
    description:
      "A premium villa with modern interiors, a private garden, and stunning views of the Himalayan range.",
    toRent: false,
    closeLandmark: "Boudhanath Stupa",
    availableFrom: "2025-01-15T00:00:00Z",
    availableTill: "2026-01-15T00:00:00Z",
    price: 12500000,
    negotiable: false,
    imageUrl: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "Sale",
    expiresOn: "2025-02-15T00:00:00Z",
    houseNumber: "12",
    street: "Boudha Road",
    wardNumber: 4,
    municipality: "Kathmandu Metropolitan City",
    city: "Kathmandu",
    district: "Kathmandu",
    province: "Bagmati",
    latitude: 27.7213,
    longitude: 85.3578,
    houseType: "Villa",
    roomCount: 4,
    floorCount: 3,
    kitchenCount: 2,
    sharedBathroom: false,
    bathroomCount: 3,
    facilities: ["Garden", "Parking", "Security", "Balcony"],
    area: "2600",
    furnished: true,
    facing: "South East",
    carParking: 2,
    bikeParking: 3,
    evCharging: true,
    builtAt: "2020-04-20T00:00:00Z",
    connectedToRoad: true,
    distanceToRoad: 12
  },
  {
    sellerEmail: "janesmith@email.com",
    title: "Modern Apartment in Pokhara",
    description:
      "A bright and airy apartment close to the lake and tourist attractions with contemporary fittings.",
    toRent: true,
    closeLandmark: "Phewa Lake",
    availableFrom: "2025-03-01T00:00:00Z",
    availableTill: "2026-03-01T00:00:00Z",
    price: 4200,
    negotiable: true,
    imageUrl: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "Rent",
    expiresOn: "2025-04-01T00:00:00Z",
    houseNumber: "8A",
    street: "Lake Side",
    wardNumber: 2,
    municipality: "Pokhara Metropolitan City",
    city: "Pokhara",
    district: "Kaski",
    province: "Gandaki",
    latitude: 28.2096,
    longitude: 83.9856,
    houseType: "Apartment",
    roomCount: 2,
    floorCount: 1,
    kitchenCount: 1,
    sharedBathroom: false,
    bathroomCount: 2,
    facilities: ["Lift", "Water Supply", "Terrace", "WiFi"],
    area: "1200",
    furnished: true,
    facing: "North",
    carParking: 1,
    bikeParking: 2,
    evCharging: false,
    builtAt: "2018-10-10T00:00:00Z",
    connectedToRoad: true,
    distanceToRoad: 8
  },
  {
    sellerEmail: "aaravsharma@email.com",
    title: "Family House in Chitwan",
    description:
      "A comfortable family home offering generous living spaces, a backyard, and easy access to the national park area.",
    toRent: false,
    closeLandmark: "Bharatpur Bus Park",
    availableFrom: "2025-04-10T00:00:00Z",
    availableTill: "2026-04-10T00:00:00Z",
    price: 9500000,
    negotiable: false,
    imageUrl: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "Sale",
    expiresOn: "2025-05-10T00:00:00Z",
    houseNumber: "21",
    street: "Maharajgunj",
    wardNumber: 12,
    municipality: "Bharatpur Metropolitan City",
    city: "Bharatpur",
    district: "Chitwan",
    province: "Bagmati",
    latitude: 27.6778,
    longitude: 84.4258,
    houseType: "House",
    roomCount: 3,
    floorCount: 2,
    kitchenCount: 1,
    sharedBathroom: false,
    bathroomCount: 2,
    facilities: ["Backyard", "Parking", "Storage", "Generator"],
    area: "1800",
    furnished: false,
    facing: "East",
    carParking: 2,
    bikeParking: 2,
    evCharging: false,
    builtAt: "2015-08-15T00:00:00Z",
    connectedToRoad: true,
    distanceToRoad: 9
  }
];

async function seedUsersTable() {
  for (const userSeed of seedUsers) {
    const hashedPassword = await bcrypt.hash(userSeed.password, NUMBER_OF_SALT_ROUNDS);

    await db
      .insert(user)
      .values({
        id: uuidv4(),
        firstName: userSeed.firstName,
        lastName: userSeed.lastName,
        email: userSeed.email,
        password: hashedPassword,
        phone: userSeed.phone,
        dob: userSeed.dob,
        bio: "",
        profilePicUrl: "",
        secondEmail: "",
        enabled: true,
        verified: true,
        isAdmin: false,
        isAgent: false,
        role: "VIEWER"
      })
      .onConflictDoNothing({ target: user.email });
  }
}

async function seedPropertyData() {
  for (const propertySeed of seedProperties) {
    const [seller] = await db.select().from(user).where(eq(user.email, propertySeed.sellerEmail)).limit(1);

    if (!seller) {
      throw new Error(`Seller not found for email: ${propertySeed.sellerEmail}`);
    }

    const addressId = uuidv4();
    const houseId = uuidv4();
    const propertyId = uuidv4();

    await db.insert(address).values({
      id: addressId,
      houseNumber: propertySeed.houseNumber,
      street: propertySeed.street,
      wardNumber: propertySeed.wardNumber,
      municipality: propertySeed.municipality,
      city: propertySeed.city,
      district: propertySeed.district,
      province: propertySeed.province,
      latitude: propertySeed.latitude,
      longitude: propertySeed.longitude,
      //We create the location point using the same coordinates saved in the address.
      //Longitude comes first, followed by latitude.
      location: sql`ST_SetSRID(
        ST_MakePoint(
          ${propertySeed.longitude}::real,
          ${propertySeed.latitude}::real
        ),
        4326)`
    });

    await db.insert(house).values({
      id: houseId,
      houseType: propertySeed.houseType,
      roomCount: propertySeed.roomCount,
      floorCount: propertySeed.floorCount,
      kitchenCount: propertySeed.kitchenCount,
      sharedBathroom: propertySeed.sharedBathroom,
      bathroomCount: propertySeed.bathroomCount,
      facilities: propertySeed.facilities.join(","),
      area: propertySeed.area,
      furnished: propertySeed.furnished,
      facing: propertySeed.facing,
      carParking: propertySeed.carParking,
      bikeParking: propertySeed.bikeParking,
      evCharging: propertySeed.evCharging,
      builtAt: propertySeed.builtAt,
      connectedToRoad: propertySeed.connectedToRoad,
      distanceToRoad: propertySeed.distanceToRoad
    });

    await db.insert(property).values({
      id: propertyId,
      sellerId: seller.id,
      propertyTypeId: houseId,
      title: propertySeed.title,
      slug: `${slugify(propertySeed.title, { lower: true })}-${propertyId.slice(0, 8)}`,
      description: propertySeed.description,
      toRent: propertySeed.toRent,
      address: addressId,
      closeLandmark: propertySeed.closeLandmark,
      propertyType: "House",
      availableFrom: propertySeed.availableFrom,
      availableTill: propertySeed.availableTill,
      price: propertySeed.price,
      negotiable: propertySeed.negotiable,
      imageUrl: propertySeed.imageUrl,
      status: propertySeed.status,
      expiresOn: propertySeed.expiresOn,
      views: 1
    });

    console.log(`Seeded property: ${propertySeed.title}`);
  }
}

async function main() {
  await seedUsersTable();
  await seedPropertyData();
  console.log("Seed complete.");
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
