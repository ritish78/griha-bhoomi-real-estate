"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import createPinIcon from "@/lib/pinIcon";

const markerIcon = createPinIcon("#18181b");

interface Props {
  latitude?: number | null;
  longitude?: number | null;
  disabled?: boolean;
  onSelect: (latitude: number, longitude: number) => void;
}

function ClickHandler({ onSelect, disabled }: Pick<Props, "onSelect" | "disabled">) {
  useMapEvents({
    click(event) {
      if (!disabled) {
        onSelect(event.latlng.lat, event.latlng.lng);
      }
    }
  });

  return null;
}

function SelectedLocation({ latitude, longitude }: Pick<Props, "latitude" | "longitude">) {
  const map = useMap();

  useEffect(() => {
    //MapContainer uses its initial centre only. We move the existing map
    //when a search result or another point is selected.
    if (latitude != null && longitude != null) {
      map.setView([latitude, longitude], Math.max(map.getZoom(), 16));
    }
  }, [latitude, longitude, map]);

  return null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onSelect,
  disabled = false
}: Props) {
  const selected = latitude != null && longitude != null;

  return (
    <div className="overflow-hidden rounded-lg border">
      <MapContainer
        center={[latitude ?? 27.7172, longitude ?? 85.324]}
        zoom={13}
        className="h-[420px] w-full z-0" //map was being displayed above navbar when scrolling down
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          attribution="&copy; Stadia Maps &copy; OpenStreetMap contributors"
        />

        <ClickHandler onSelect={onSelect} disabled={disabled} />

        <SelectedLocation latitude={latitude} longitude={longitude} />

        {selected && (
          <Marker
            position={[latitude, longitude]}
            icon={markerIcon}
            draggable={!disabled}
            eventHandlers={{
              dragend(event) {
                if (disabled) return;

                const { lat, lng } = event.target.getLatLng();
                onSelect(lat, lng);
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
