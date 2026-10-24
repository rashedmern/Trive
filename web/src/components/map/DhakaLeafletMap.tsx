import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { LatLng, NearbyCourier } from "../../types/delivery";

// Fix default leaflet icons
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom SVG Icons
const createPulseIcon = (color: string, label: string) => {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background-color: ${color}; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background-color: ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white;">
          <span style="font-size: 14px; color: white;">${label}</span>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const scooterIcon = createPulseIcon("#10B981", "🛵");
const vanIcon = createPulseIcon("#3B82F6", "🚐");
const pickupPin = createPulseIcon("#F59E0B", "📦");
const dropoffPin = createPulseIcon("#FF2D55", "📍");
const driverCarPin = createPulseIcon("#111111", "🚗");

interface DhakaLeafletMapProps {
  routePoints?: LatLng[];
  couriers?: NearbyCourier[];
  driverPosition?: LatLng;
  showAllCouriers?: boolean;
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (courier: NearbyCourier) => void;
}

const ChangeMapView: React.FC<{ center: [number, number]; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const DhakaLeafletMap: React.FC<DhakaLeafletMapProps> = ({
  routePoints = [],
  couriers = [],
  driverPosition,
  showAllCouriers = true,
  center = [23.774, 90.395],
  zoom = 13,
  height = "100%",
  onMarkerClick,
}) => {
  const polylineCoords: [number, number][] = routePoints.map((p) => [
    p.latitude,
    p.longitude,
  ]);

  const originPoint = routePoints.length > 0 ? routePoints[0] : null;
  const destPoint =
    routePoints.length > 1 ? routePoints[routePoints.length - 1] : null;

  return (
    <div style={{ height, width: "100%", position: "relative" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 10 }}
      >
        <ChangeMapView center={center} zoom={zoom} />

        {/* Free Standard OpenStreetMap Tiles - 100% open, zero API key required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dijkstra Shortest Path Polyline */}
        {polylineCoords.length > 1 && (
          <>
            {/* Outer Pink Glow Line */}
            <Polyline
              positions={polylineCoords}
              pathOptions={{
                color: "#FF2D55",
                weight: 8,
                opacity: 0.35,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            {/* Inner Route Line */}
            <Polyline
              positions={polylineCoords}
              pathOptions={{
                color: "#FF2D55",
                weight: 4,
                opacity: 0.95,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}

        {/* Origin / Pickup Marker */}
        {originPoint && (
          <Marker
            position={[originPoint.latitude, originPoint.longitude]}
            icon={pickupPin}
          >
            <Popup>
              <div className="text-xs font-sans">
                <p className="font-bold text-neutral-800">Pickup Location</p>
                <p className="text-neutral-600">Road 27, Dhanmondi</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination / Dropoff Marker */}
        {destPoint && (
          <Marker
            position={[destPoint.latitude, destPoint.longitude]}
            icon={dropoffPin}
          >
            <Popup>
              <div className="text-xs font-sans">
                <p className="font-bold text-neutral-800">Delivery Destination</p>
                <p className="text-neutral-600">2210 Coral Way / Gulshan 2</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Live Driver Marker */}
        {driverPosition && (
          <Marker
            position={[driverPosition.latitude, driverPosition.longitude]}
            icon={driverCarPin}
          >
            <Popup>
              <div className="text-xs font-sans">
                <p className="font-bold text-neutral-900">Current Courier Unit</p>
                <p className="text-emerald-600 font-semibold">Active Turn-by-Turn GPS</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Radial Nearby Couriers (BFS Radar) */}
        {showAllCouriers &&
          couriers.map((courier) => (
            <Marker
              key={courier.id}
              position={[courier.latitude, courier.longitude]}
              icon={courier.vehicleType === "van" ? vanIcon : scooterIcon}
              eventHandlers={{
                click: () => onMarkerClick?.(courier),
              }}
            >
              <Popup>
                <div className="text-xs font-sans p-1">
                  <p className="font-bold text-neutral-900">{courier.name}</p>
                  <p className="text-neutral-600">{courier.zoneName}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-emerald-600 font-semibold">
                      ★ {courier.rating}
                    </span>
                    <span className="text-neutral-500">
                      {courier.distanceMiles} mi • {courier.etaMinutes} min away
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};
