import { divIcon } from "leaflet";

export default function createMultiplePropertiesIcon(count: number) {
  return divIcon({
    className: "",
    html: `
      <div
        style="
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #18181b;
          color: white;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        "
      >
        ${count}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
}
