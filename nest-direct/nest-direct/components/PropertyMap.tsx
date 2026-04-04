"use client";

import { Component, type ReactNode } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
}

class MapErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#f7f7f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: "0.875rem",
          }}
        >
          Map unavailable
        </div>
      );
    }
    return this.props.children;
  }
}

export function PropertyMap({ latitude, longitude }: PropertyMapProps) {
  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f7f7f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: "0.875rem",
        }}
      >
        Map unavailable
      </div>
    );
  }

  return (
    <MapErrorBoundary>
      <Map
        initialViewState={{ longitude, latitude, zoom: 15 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <Marker
          longitude={longitude}
          latitude={latitude}
          color="hsl(35, 80%, 56%)"
        />
        <NavigationControl position="top-right" />
      </Map>
    </MapErrorBoundary>
  );
}
