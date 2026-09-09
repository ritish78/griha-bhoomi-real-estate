import { Request, Response, NextFunction, Router } from "express";
import { NominatimReverseResponse } from "src/types/address";
import { BadRequestError } from "src/utils/error";
import { extractWardNumber } from "src/utils/extractWardNumber";

const router = Router();

router.get("/reverse", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return next(new BadRequestError("latitude and longitude are required"));
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return next(new BadRequestError("Invalid coordinates"));
    }

    const nominatimUrl = process.env.NOMINATIM_URL ?? "http://localhost:8080";

    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: "jsonv2",
      addressdetails: "1",
      zoom: "18"
    });

    const response = await fetch(`${nominatimUrl}/reverse?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Nominatim returned ${response.status}`);
    }

    const result = (await response.json()) as NominatimReverseResponse;

    const address = result.address ?? {};

    return res.status(200).json({
      latitude,
      longitude,

      displayName: result.display_name ?? null,

      houseNumber: address.house_number ?? null,

      street: address.road ?? address.pedestrian ?? address.residential ?? null,

      municipality: address.municipality ?? address.city ?? null,

      city: address.city ?? address.town ?? address.village ?? address.municipality ?? null,

      district: address.county ?? address.state_district ?? null,

      province: address.state ?? null,

      //We don't need to extract ward number from the address because Nominatim doesn't provide it. Instead, we can extract it from the house number if it's in the format "house number, ward number".
      wardNumber: extractWardNumber(address)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
