import { FACILITIES } from "@/types/facilities";
import z from "zod";
import { DIMENSION_UNITS, isValidDimensionAmount } from "./propertyDimension";

const dimensionAmountSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || isValidDimensionAmount(value),
    "Enter a non-negative number for the dimension."
  )
  .optional();

export const propertyFormSchema = z.object({
  // Basic Property Details
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  negotiable: z.boolean().default(false),
  toRent: z.boolean().default(false), // false = Sale, true = Rent
  propertyType: z.enum(["House", "Land"]),
  status: z.enum(["Sale", "Rent", "Hold", "Sold"]).default("Sale"),
  availableFrom: z.date({
    required_error: "Available from date is required"
  }),
  availableTill: z.date({
    required_error: "Available till date is required"
  }),

  // Address
  street: z.string().min(2, "Street address is required"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  municipality: z.string().optional(),
  wardNumber: z.coerce.number().optional(),
  province: z.string().min(2, "Province is required"),
  houseNumber: z.string().optional(),
  closeLandmark: z.string().optional(),
  latitude: z
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude")
    .nullable()
    .optional(),
  longitude: z
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude")
    .nullable()
    .optional(),
  imageUrl: z.array(z.string()).optional().default([]),
  locationConfirmed: z.boolean().refine((value) => value, "Please confirm the property location!"),

  //For House
  houseType: z.string().optional().default("House"),
  roomCount: z.coerce.number().optional().default(0),
  bathroomCount: z.coerce.number().optional().default(0),
  floorCount: z.coerce.number().optional().default(0),
  kitchenCount: z.coerce.number().optional().default(0),
  furnished: z.boolean().optional().default(false),
  facing: z.string().optional(),
  carParking: z.coerce.number().optional().default(0),
  bikeParking: z.coerce.number().optional().default(0),
  builtAt: z.coerce.date().optional(),
  sharedBathroom: z.boolean().optional().default(false),
  facilities: z.array(z.string()).max(FACILITIES.length).default([]),
  evCharging: z.boolean().optional().default(false),

  //For House and Land
  area: z
    .string()
    .trim()
    .min(1, "Please enter the property area")
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) > 0,
      "Area must be greater than 0"
    ),
  areaUnit: z.enum(["sq-ft", "sq-m", "aana", "dhur", "kattha", "bigha"]),

  //For Land
  landType: z.string().optional(),
  length: dimensionAmountSchema,
  lengthUnit: z.enum(DIMENSION_UNITS).default("ft"),
  breadth: dimensionAmountSchema,
  breadthUnit: z.enum(DIMENSION_UNITS).default("ft"),

  //For both House and Land
  connectedToRoad: z.boolean().optional(),
  distanceToRoad: z.coerce.number().optional()
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
