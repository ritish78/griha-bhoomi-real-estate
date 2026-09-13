import { Request, Response, NextFunction, Router } from "express";
import { NominatimReverseResponse } from "src/types/address";
import { BadRequestError } from "src/utils/error";
import { extractWardNumber } from "src/utils/extractWardNumber";

const router = Router();

/**
 * @route         GET /api/v1/geo/reverse
 * @desc          Reverse geocode latitude and longitude to address
 * @access        Public
 */
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
      zoom: "18",
      "accept-language": "en"
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

      street: address.road ?? null,

      city: address.suburb ?? null,

      municipality: address.city ?? null,

      district: address.county ?? null,

      province: address.state ?? null,

      wardNumber: extractWardNumber(address)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
