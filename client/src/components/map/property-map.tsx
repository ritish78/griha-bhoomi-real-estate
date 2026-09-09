"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import createPinIcon from "@/lib/pinIcon";
import { formatPrice } from "@/lib/formatPrice";
import BoundsTracker from "./bounds-tracker";
import { MapBounds, MapProperty } from "@/types/property";
import Link from "next/link";
import Image from "next/image";
import createMultiplePropertiesIcon from "./multiple-poperties-icon";
import PropertyPopup from "./property-popup";

const defaultIcon = createPinIcon("#18181b"); //properties
const searchIcon = createPinIcon("white", "#18181b"); //white with dark border for search

//Handles click on map to set search center
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function PropertyMap() {
  const [allProperties, setAllProperties] = useState<MapProperty[]>([]);
  const [nearbyProperties, setNearbyProperties] = useState<MapProperty[]>([]);
  const [searchCenter, setSearchCenter] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [radius, setRadius] = useState(5); //the initial disatnce is 5km
  const [isSearching, setIsSearching] = useState(false);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const handleBoundsChange = useCallback((newBounds: MapBounds) => {
    setBounds((prev) => {
      if (
        prev?.minLatitude === newBounds.minLatitude &&
        prev?.maxLatitude === newBounds.maxLatitude &&
        prev?.minLongitude === newBounds.minLongitude &&
        prev?.maxLongitude === newBounds.maxLongitude
      ) {
        return prev;
      }
      return newBounds;
    });
  }, []);

  //fetching all properties on mount
  //Now, changing to fetching properties on the basis of user's view port
  //   useEffect(() => {
  //     async function fetchAll() {
  //       const res = await fetch("http://localhost:5000/api/v1/property");
  //       const data = await res.json();
  //       setAllProperties(data);
  //     }
  //     fetchAll();
  //   }, []);
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
  useEffect(() => {
    if (!bounds) return;
    //Optimizing. When the user has selected a point in map, we don't want to fetch
    //properties when the user is zooming in/out or moving in the map.
    if (searchCenter) return;

    const timer = setTimeout(async () => {
      const { minLatitude, maxLatitude, minLongitude, maxLongitude } = bounds;
      const res = await fetch(
        `${API_URL}/api/v1/property/map/viewport?minLatitude=${minLatitude}&maxLatitude=${maxLatitude}&minLongitude=${minLongitude}&maxLongitude=${maxLongitude}`
      );

      //the server sends 429 Too Many Requests if the user is moving the map too fast. So we need to handle that.
      if (res.status === 429) {
        console.warn("Too many requests. Please slow down.");
        return;
      }

      const data = await res.json();

      console.log("viewport data: ", data);
      console.log("is Array: ", Array.isArray(data));
      setAllProperties(data);
    }, 300);

    return () => clearTimeout(timer);
  }, [bounds, searchCenter]);

  //fetching nearby properties when search center or radius changes
  useEffect(() => {
    if (!searchCenter) return;

    async function fetchNearby() {
      try {
        setIsSearching(true);
        const res = await fetch(
          `${API_URL}/api/v1/property/map/nearby?latitude=${searchCenter!.latitude}&longitude=${searchCenter!.longitude}&radius=${radius}`
        );

        //the server sends 429 Too Many Requests if the user is moving the map too fast. So we need to handle that.
        if (res.status === 429) {
          console.warn("Too many requests. Please slow down.");
          return;
        }

        const data = await res.json();
        setNearbyProperties(data);
      } catch (error) {
        console.error("Error fetching nearby properties:", error);
      } finally {
        setIsSearching(false);
      }
    }

    fetchNearby();
  }, [searchCenter, radius]);

  const handleMapClick = (latitude: number, longitude: number) => {
    setSearchCenter({ latitude, longitude });
  };

  //Properties to display as markers
  const displayProperties = searchCenter ? nearbyProperties : allProperties;

  const groupedProperties = useMemo(() => {
    const groups = new Map<string, MapProperty[]>();

    for (const property of displayProperties) {
      //6 decimal places is precise enough to identify effectivel identical property coordinates.
      const key = `${property.latitude.toFixed(6)}:${property.longitude.toFixed(6)}`;

      const existing = groups.get(key);

      if (existing) {
        existing.push(property);
      } else {
        groups.set(key, [property]);
      }
    }

    return Array.from(groups.values());
  }, [displayProperties]);

  return (
    <div className="flex flex-col gap-4 p-4 h-screen bg-background text-foreground">
      <div className="flex items-center gap-6 px-4 py-3 rounded-lg border bg-card shadow-sm">
        <h1 className="text-lg font-semibold tracking-tight">Property Map</h1>

        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Radius: {radius}km</label>

          <input
            type="range"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-40 accent-primary"
          />
        </div>

        {searchCenter && (
          <button
            onClick={() => {
              setSearchCenter(null);
              setNearbyProperties([]);
            }}
            className="text-sm px-3 py-1.5 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Clear Search
          </button>
        )}

        <p className="text-sm text-muted-foreground ml-auto">
          {searchCenter
            ? isSearching
              ? "Searching!"
              : `${nearbyProperties.length} properties within ${radius}km`
            : "Click anywhere on the map to search by radius"}
        </p>
      </div>

      <MapContainer
        center={[27.7172, 85.324]}
        zoom={12}
        className="flex-1 rounded-xl border shadow-sm z-0"
        zoomControl={true}
        attributionControl={true}
      >
        <BoundsTracker onChange={handleBoundsChange} />

        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          //   url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" //Could also use this one
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapClickHandler onClick={handleMapClick} />

        {searchCenter && (
          <>
            <Marker position={[searchCenter.latitude, searchCenter.longitude]} icon={searchIcon} />
            <Circle
              center={[searchCenter.latitude, searchCenter.longitude]}
              radius={radius * 1000}
              pathOptions={{
                color: "#18181b",
                fillColor: "#18181b",
                fillOpacity: 0.05,
                weight: 1.5
              }}
            />
          </>
        )}
        {groupedProperties.map((properties) => {
          const firstProperty = properties[0];

          if (!firstProperty) {
            return null;
          }

          const hasMultipleProperties = properties.length > 1;

          return (
            <Marker
              key={`${firstProperty.latitude}-${firstProperty.longitude}`}
              position={[firstProperty.latitude, firstProperty.longitude]}
              icon={
                hasMultipleProperties
                  ? createMultiplePropertiesIcon(properties.length)
                  : defaultIcon
              }
            >
              <Popup
                minWidth={hasMultipleProperties ? 400 : 330}
                maxWidth={hasMultipleProperties ? 460 : 360}
                className="property-card-popup"
              >
                {hasMultipleProperties ? (
                  <div className="flex flex-col">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-semibold" style={{ margin: 0 }}>
                        {properties.length} properties at this location
                      </p>

                      <p className="text-xs text-zinc-500" style={{ margin: 0 }}>
                        {firstProperty.municipality}, {firstProperty.province}
                      </p>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto">
                      {properties.map((p) => (
                        <Link
                          key={p.id}
                          href={`/property/${p.slug}`}
                          className="flex gap-3 p-3 border-b last:border-b-0 hover:bg-zinc-50 transition-colors"
                        >
                          <div className="relative w-24 h-[72px] shrink-0 overflow-hidden rounded-md bg-zinc-100">
                            {p.imageUrl?.[0] ? (
                              <Image
                                src={p.imageUrl[0]}
                                alt={p.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[10px] text-zinc-500">No image</span>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-bold line-clamp-2" style={{ margin: 0 }}>
                              {p.title}
                            </p>

                            <p className="text-xs text-zinc-500" style={{ margin: 0 }}>
                              {p.propertyType} · {p.status}
                            </p>

                            <p
                              className="text-sm font-semibold mt-1 text-zinc-600"
                              style={{ margin: 0 }}
                            >
                              Rs. {formatPrice(p.price)}
                              {p.status === "Rent" && (
                                <span className="text-[11px] font-normal text-zinc-500 ml-1">
                                  /month
                                </span>
                              )}
                            </p>

                            {p.distanceKm != null && (
                              <p className="text-[11px] text-zinc-500" style={{ margin: 0 }}>
                                {p.distanceKm} km away
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <PropertyPopup property={firstProperty} />
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
