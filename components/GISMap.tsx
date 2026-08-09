"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface GISMapProps {
  center: [number, number];
  zoom: number;
  activeLayerColor: string | null;
  selectedZoneIndex: number | null;
  zoneData: any[];
  farmBoundary: [number, number][];
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (map && map.setView) {
        try {
          map.setView(center, zoom);
        } catch (e) {
          console.warn("Leaflet setView error:", e);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
}

export default function GISMap({ center, zoom, activeLayerColor, selectedZoneIndex, zoneData, farmBoundary }: GISMapProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        zoomControl={false} // Disable default top-left control so we can use our custom ones or reposition
      >
        <MapUpdater center={center} zoom={zoom} />
        
        {/* Esri World Imagery (High-res Satellite) */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri &mdash; Source: Esri"
          maxZoom={19}
        />
        
        {/* Farm Boundary */}
        <Polygon positions={farmBoundary} pathOptions={{ color: "#3b82f6", weight: 3, fillOpacity: 0 }} />

        {/* Selected Zone Highlighting */}
        {selectedZoneIndex !== null && zoneData[selectedZoneIndex] && (
          <Polygon 
            positions={zoneData[selectedZoneIndex].bounds} 
            pathOptions={{ color: "#22c55e", weight: 4, fillColor: "#22c55e", fillOpacity: 0.3 }} 
          />
        )}
      </MapContainer>

      {/* Layer Overlay Tint Simulation */}
      {activeLayerColor && (
        <div 
          style={{ 
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: activeLayerColor, opacity: 0.35, 
            mixBlendMode: "multiply", zIndex: 5, pointerEvents: "none" 
          }} 
        />
      )}
    </div>
  );
}
