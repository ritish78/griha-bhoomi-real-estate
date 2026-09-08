import { MapBounds } from "@/types/property";
import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

export default function BoundsTracker({ onChange }: { onChange: (bounds: MapBounds) => void }) {
  const map = useMapEvents({
    load() {
      const b = map.getBounds();
      onChange({
        minLatitude: b.getSouth(),
        maxLatitude: b.getNorth(),
        minLongitude: b.getWest(),
        maxLongitude: b.getEast()
      });
    },
    moveend() {
      const b = map.getBounds();
      onChange({
        minLatitude: b.getSouth(),
        maxLatitude: b.getNorth(),
        minLongitude: b.getWest(),
        maxLongitude: b.getEast()
      });
    },
    zoomend() {
      const b = map.getBounds();
      onChange({
        minLatitude: b.getSouth(),
        maxLatitude: b.getNorth(),
        minLongitude: b.getWest(),
        maxLongitude: b.getEast()
      });
    }
  });

  useEffect(() => {
    const b = map.getBounds();
    onChange({
      minLatitude: b.getSouth(),
      maxLatitude: b.getNorth(),
      minLongitude: b.getWest(),
      maxLongitude: b.getEast()
    });
  }, []);
  return null;
}
