import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path, Line } from "react-native-svg";
import { Colors } from "@/constants/theme";

export const PROVIDER_GOOGLE = "google";
export const PROVIDER_DEFAULT = "default";

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface MapViewProps {
  style?: any;
  initialRegion?: any;
  children?: React.ReactNode;
  provider?: string;
  showsCompass?: boolean;
  showsBuildings?: boolean;
}

export interface MarkerProps {
  coordinate: LatLng;
  title?: string;
  description?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export interface PolylineProps {
  coordinates: LatLng[];
  strokeColor?: string;
  strokeWidth?: number;
  lineDashPattern?: number[];
}

function projectCoord(coord: LatLng): { left: string; top: string } {
  // Bounding box for Dhaka Central Corridor
  const minLat = 23.730;
  const maxLat = 23.820;
  const minLng = 90.350;
  const maxLng = 90.435;

  const latRatio = (coord.latitude - minLat) / (maxLat - minLat);
  const lngRatio = (coord.longitude - minLng) / (maxLng - minLng);

  // Inverted Y (higher latitude = higher up = lower top %)
  const topPercent = Math.max(5, Math.min(95, (1 - latRatio) * 100));
  const leftPercent = Math.max(5, Math.min(95, lngRatio * 100));

  return {
    top: `${topPercent.toFixed(1)}%`,
    left: `${leftPercent.toFixed(1)}%`,
  };
}

export function MapView({ style, children }: MapViewProps) {
  return (
    <View style={[styles.mapContainer, style]}>
      {/* Dhaka Urban Street Grid Background Simulation */}
      <Svg
        width="100%"
        height="100%"
        style={StyleSheet.absoluteFill}
        viewBox="0 0 400 700"
        preserveAspectRatio="none"
      >
        {/* River / Waterway */}
        <Path
          d="M 20 680 Q 150 630 250 660 T 380 690"
          stroke="#1E293B"
          strokeWidth="32"
          fill="none"
        />
        <Path
          d="M 330 200 Q 300 350 310 500 T 340 650"
          stroke="#1E293B"
          strokeWidth="14"
          fill="none"
        />

        {/* Major Arteries (Mirpur Rd, Airport Rd, Pragati Sarani) */}
        <Line x1="100" y1="50" x2="160" y2="650" stroke="#334155" strokeWidth="6" />
        <Line x1="220" y1="20" x2="210" y2="680" stroke="#475569" strokeWidth="8" />
        <Line x1="320" y1="60" x2="280" y2="670" stroke="#334155" strokeWidth="5" />

        {/* Cross Streets */}
        <Line x1="40" y1="220" x2="360" y2="210" stroke="#334155" strokeWidth="4" />
        <Line x1="20" y1="360" x2="380" y2="370" stroke="#334155" strokeWidth="4" />
        <Line x1="30" y1="510" x2="370" y2="500" stroke="#334155" strokeWidth="5" />

        {/* Airport Runway Accent */}
        <Line x1="160" y1="340" x2="185" y2="390" stroke="#64748B" strokeWidth="6" strokeDasharray="6,4" />
      </Svg>

      {/* Children: Markers and Polylines */}
      {children}
    </View>
  );
}

export function Marker({ coordinate, onPress, title, children }: MarkerProps) {
  const { top, left } = projectCoord(coordinate);

  return (
    <View
      style={[
        styles.markerAnchor,
        {
          top: top as any,
          left: left as any,
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.markerHitBox}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
}

export function Polyline({ coordinates, strokeColor = Colors.accentPink, strokeWidth = 4 }: PolylineProps) {
  if (!coordinates || coordinates.length < 2) return null;

  // Render SVG route line connecting projected points
  const points = coordinates.map((c) => {
    const minLat = 23.730;
    const maxLat = 23.820;
    const minLng = 90.350;
    const maxLng = 90.435;

    const latRatio = (c.latitude - minLat) / (maxLat - minLat);
    const lngRatio = (c.longitude - minLng) / (maxLng - minLng);

    const x = Math.max(10, Math.min(390, lngRatio * 400));
    const y = Math.max(10, Math.min(690, (1 - latRatio) * 700));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  return (
    <Svg
      width="100%"
      height="100%"
      style={[StyleSheet.absoluteFill, { pointerEvents: "none" } as any]}
      viewBox="0 0 400 700"
      preserveAspectRatio="none"
    >
      <Path
        d={pathD}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#0B1120",
    overflow: "hidden",
  },
  markerAnchor: {
    position: "absolute",
    marginLeft: -18,
    marginTop: -18,
    zIndex: 10,
  },
  markerHitBox: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MapView;
