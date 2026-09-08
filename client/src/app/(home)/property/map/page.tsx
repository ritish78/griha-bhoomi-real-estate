"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/map/property-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Loading map!</p>
    </div>
  )
});

export default function MapPage() {
  return <PropertyMap />;
}
