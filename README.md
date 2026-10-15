# Trive - Logistics Mobile App

A modern logistics and route navigation mobile application built with Expo and React Native, featuring interactive graph-based routing algorithms (Dijkstra, BFS, Kruskal MST, DFS Reachability) and Google Maps integration.

## Features

- **Interactive Map Canvas & Routing**: Graph-based pathfinding algorithms for route computation.
- **Dynamic Logistics Dashboard**: Real-time parcel and route tracking.
- **Order Management & Inspection**: Detailed parcel specs, interactive swipe action confirmation, and bottom sheet dock.
- **Turn-by-turn Navigation HUD**: Live delivery tracking and navigation indicators.

## Tech Stack

- **Framework**: Expo (React Native)
- **Map & Geolocation**: `react-native-maps`, `expo-location`
- **Vector Graphics & Canvas**: `react-native-svg`
- **Iconography**: `lucide-react-native`, `@expo/vector-icons`
- **Interaction & Safe Area**: `react-native-safe-area-context`, `react-native-screens`, `react-native-gesture-handler`

## Project Structure

```
├── assets/                  # Icons, splash screen, and SVG branding
├── docs/                    # Design, PRD, and technical documentation
├── src/
│   ├── algorithms/          # Pathfinding & graph algorithms (Dijkstra, BFS, Kruskal, DFS)
│   ├── components/          # Reusable UI components & maps canvas
│   ├── constants/           # Colors and typography tokens
│   ├── data/                # City graph and mock delivery parcels
│   └── screens/             # Core screens (Dashboard, OrderDetails, Navigation)
├── App.js                   # Root application component
├── app.json                 # Expo configuration
└── package.json             # Project dependencies and scripts
```

## Getting Started

```bash
# Start the Expo development server
npx expo start
```
