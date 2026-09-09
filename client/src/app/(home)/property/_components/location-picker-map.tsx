"use client";

import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import createPinIcon from "@/lib/pinIcon";

const markerIcon = createPinIcon("#18181b");

interface Props {
  latitude?: number | null;
  longitude?: number | null;

  onSelect: (latitude: number, longitude: number) => void;
}

function ClickHandler({ onSelect }: { onSelect: (latitude: number, longitude: number) => void }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    }
  });

  return null;
}

export default function LocationPickerMap({ latitude, longitude, onSelect }: Props) {
  const selected = latitude != null && longitude != null;

  return (
    <div className="overflow-hidden rounded-lg border">
      <MapContainer
        center={[latitude ?? 27.7172, longitude ?? 85.324]}
        zoom={13}
        className="h-[420px] w-full"
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          attribution="&copy; Stadia Maps &copy; OpenStreetMap contributors"
        />

        <ClickHandler onSelect={onSelect} />

        {selected && <Marker position={[latitude, longitude]} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
}
