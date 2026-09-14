import { Request, Response, NextFunction, Router } from "express";
import { NominatimReverseResponse, NominatimSearchResult } from "src/types/address";
import { BadRequestError, ServerError } from "src/utils/error";
import { extractWardNumber } from "src/utils/extractWardNumber";
import { isNominatimSearchResult } from "src/utils/isNominatimSearchResult";
import { normaliseNominatimAddress } from "src/utils/normaliseNominatimAddress";

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

    console.log("Raw Nominatim address:", JSON.stringify(result.address, null, 2));

    const address = result.address ?? {};

    return res.status(200).json({
      latitude,
      longitude,

      displayName: result.display_name ?? null,

      ...normaliseNominatimAddress(address)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route         GET /api/v1/geo/search
 * @desc          Search for locations based on a query string
 * @access        Public
 */
router.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

    if (query.length < 2 || query.length > 200) {
      throw new BadRequestError("Enter a location between 2 and 200 characters.");
    }

    const baseUrl = (process.env.NOMINATIM_URL ?? "http://localhost:8080").replace(/\/$/, "");

    const params = new URLSearchParams({
      q: query,
      format: "jsonv2",
      countrycodes: "np",
      limit: "5",
      "accept-language": "en"
    });

    const response = await fetch(`${baseUrl}/search?${params.toString()}`, {
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new ServerError("Location search is temporarily unavailable.");
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new ServerError("Location search returned an invalid response.");
    }

    const results = data.filter(isNominatimSearchResult);

    if (!Array.isArray(results)) {
      throw new ServerError("Location search returned an invalid response.");
    }

    const locations = results
      .map((result) => ({
        id: `${result.osm_type}:${result.osm_id}`,
        label: result.display_name,
        latitude: Number(result.lat),
        longitude: Number(result.lon)
      }))
      .filter(
        (location) =>
          typeof location.label === "string" &&
          Number.isFinite(location.latitude) &&
          Number.isFinite(location.longitude) &&
          location.latitude >= -90 &&
          location.latitude <= 90 &&
          location.longitude >= -180 &&
          location.longitude <= 180
      );

    return res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
});

export default router;
