"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { divIcon, latLngBounds } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { Button } from "@/components/ui/button";
import PropertyPopup from "@/components/map/property-popup";
import type { MapBounds, MapProperty } from "@/types/property";

import "leaflet/dist/leaflet.css";
import { formatPrice } from "@/lib/formatPrice";

interface SearchPropertyMapProps {
  properties: MapProperty[];
  query: string;
  activePropertyId: string | null;
  pending: boolean;
  onSearchArea: (bounds: MapBounds) => void;
}

function getMapBounds(map: ReturnType<typeof useMap>): MapBounds {
  const bounds = map.getBounds();

  return {
    minLatitude: Math.max(-90, bounds.getSouth()),
    maxLatitude: Math.min(90, bounds.getNorth()),
    minLongitude: Math.max(-180, bounds.getWest()),
    maxLongitude: Math.min(180, bounds.getEast())
  };
}

function MapControls({
  properties,
  query,
  pending,
  onSearchArea
}: Omit<SearchPropertyMapProps, "activePropertyId">) {
  const map = useMap();

  const [hasMoved, setHasMoved] = useState(false);

  //We only set the initial view when this search is opened.
  //Hovering a card must not move the map.
  const initialSearch = useRef({ properties, query });

  useEffect(() => {
    const params = new URLSearchParams(initialSearch.current.query);

    const minLatitude = params.get("minlatitude");
    const maxLatitude = params.get("maxlatitude");
    const minLongitude = params.get("minlongitude");
    const maxLongitude = params.get("maxlongitude");

    const latitude = params.get("latitude");
    const longitude = params.get("longitude");
    const radius = params.get("radius");

    if (
      minLatitude !== null &&
      maxLatitude !== null &&
      minLongitude !== null &&
      maxLongitude !== null
    ) {
      map.fitBounds(
        [
          [Number(minLatitude), Number(minLongitude)],
          [Number(maxLatitude), Number(maxLongitude)]
        ],
        { animate: false }
      );
    } else if (latitude !== null && longitude !== null) {
      const centre = latLngBounds([
        [Number(latitude), Number(longitude)],
        [Number(latitude), Number(longitude)]
      ]).getCenter();

      //The selected location takes priority over the returned markers.
      map.fitBounds(centre.toBounds(Number(radius || 3) * 2000), {
        animate: false,
        maxZoom: 16
      });
    } else if (initialSearch.current.properties.length > 0) {
      map.fitBounds(
        latLngBounds(
          initialSearch.current.properties.map((property): [number, number] => [
            property.latitude,
            property.longitude
          ])
        ),
        {
          padding: [35, 35],
          maxZoom: 15,
          animate: false
        }
      );
    }

    const initialBounds = map.getBounds();

    function handleMoveEnd() {
      setHasMoved(!map.getBounds().equals(initialBounds, 0.00001));
    }

    map.on("moveend", handleMoveEnd);

    //The map needs to recalculate its size when the responsive layout changes.
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize({ pan: false });
    });

    resizeObserver.observe(map.getContainer());

    return () => {
      map.off("moveend", handleMoveEnd);
      resizeObserver.disconnect();
    };
  }, [map]);

  if (!hasMoved) {
    return null;
  }

  return (
    <div className="absolute left-1/2 top-3 z-[500] -translate-x-1/2">
      <Button
        type="button"
        variant="outline"
        className="whitespace-nowrap bg-background shadow-sm"
        disabled={pending}
        onClick={() => onSearchArea(getMapBounds(map))}
      >
        {pending ? "Searching..." : "Search this area"}
      </Button>
    </div>
  );
}

export default function SearchPropertyMap({
  properties,
  query,
  activePropertyId,
  pending,
  onSearchArea
}: SearchPropertyMapProps) {
  const groupedProperties = useMemo(() => {
    const groups = new Map<string, MapProperty[]>();

    //Listings can share the same coordinates. We keep them in one marker
    //so that one listing does not hide another listing's marker.
    for (const property of properties) {
      const key = `${property.latitude.toFixed(6)}:${property.longitude.toFixed(6)}`;

      const existing = groups.get(key);

      if (existing) {
        existing.push(property);
      } else {
        groups.set(key, [property]);
      }
    }

    return Array.from(groups.values());
  }, [properties]);

  return (
    <MapContainer
      center={[27.7172, 85.324]}
      zoom={12}
      minZoom={3}
      maxBounds={[
        [-85, -180],
        [85, 180]
      ]}
      maxBoundsViscosity={1}
      className="h-full w-full bg-muted"
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        noWrap
      />

      <MapControls
        properties={properties}
        query={query}
        pending={pending}
        onSearchArea={onSearchArea}
      />

      {groupedProperties.map((propertiesAtLocation) => {
        const firstProperty = propertiesAtLocation[0];

        if (!firstProperty) {
          return null;
        }

        const isActive = propertiesAtLocation.some((property) => property.id === activePropertyId);
        //If multiple listings share this location, we highlight the marker
        //when at least one of those listings is featured.
        const isFeatured = propertiesAtLocation.some((property) => property.featured);

        //We use the same lakh and crore format as the property cards.
        const label =
          propertiesAtLocation.length > 1
            ? `${propertiesAtLocation.length} listings`
            : `Rs. ${formatPrice(firstProperty.price)}`;

        const icon = divIcon({
          className: "property-search-marker",
          html: `<span class="property-search-marker-label ${
            isFeatured ? "is-featured" : ""
          } ${isActive ? "is-active" : ""}">${label}</span>`,
          iconSize: [100, 34],
          iconAnchor: [50, 34],
          popupAnchor: [0, -34]
        });

        return (
          <Marker
            key={`${firstProperty.latitude}:${firstProperty.longitude}`}
            position={[firstProperty.latitude, firstProperty.longitude]}
            icon={icon}
            zIndexOffset={isActive ? 1000 : 0}
          >
            <Popup minWidth={240} maxWidth={280} className="property-card-popup">
              <div className="max-h-80 overflow-y-auto">
                {propertiesAtLocation.map((property) => (
                  <div key={property.id} className="border-b last:border-b-0">
                    <PropertyPopup property={property} />
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
