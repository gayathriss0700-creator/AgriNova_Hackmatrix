"use client";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useCallback } from "react";

interface LeafletDefaultPrototype {
  _getIconUrl?: () => string;
}

interface ClickMarker {
  lat: number;
  lng: number;
}

delete (L.Icon.Default.prototype as LeafletDefaultPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function colorIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function clickIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:32px;
      height:32px;
      border-radius:50%;
      background:#3b82f6;
      border:3px solid white;
      box-shadow:0 2px 10px rgba(0,0,0,0.4);
      display:flex;
      align-items:center;
      justify-content:center;
      animation:pulse 1.5s infinite;
    ">
      <div style="width:12px;height:12px;background:white;border-radius:50%"></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
      }
    </style>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// No hardcoded farm markers - completely dynamic click-based map
interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapViewProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: ClickMarker | null;
}

export default function MapView({ onLocationSelect, selectedLocation }: MapViewProps) {
  const [clickedLocation, setClickedLocation] = useState<ClickMarker | null>(selectedLocation ?? null);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    const newLoc = { lat, lng };
    setClickedLocation(newLoc);
    onLocationSelect?.(lat, lng);
  }, [onLocationSelect]);

  return (
    <div style={{ height: 420, borderRadius: 10, overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.85; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satellite View">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street View">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Hybrid (Satellite + Labels)">
            <LayerGroup>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution=""
              />
            </LayerGroup>
          </LayersControl.BaseLayer>
        </LayersControl>
        <ZoomControl position="topleft" />
        <MapClickHandler onMapClick={handleMapClick} />
        
        {/* Dynamic Location Marker Only */}
        {clickedLocation && (
          <Marker position={[clickedLocation.lat, clickedLocation.lng]} icon={clickIcon()}>
            <Popup>
              <div style={{ fontSize: 13, minWidth: 160 }}>
                <strong>Selected Location</strong>
                <div style={{ marginTop: 4 }}>Lat: {clickedLocation.lat.toFixed(4)}</div>
                <div>Lng: {clickedLocation.lng.toFixed(4)}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      <div style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        background: "white",
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 12,
        color: "#6b7280",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        zIndex: 1000,
      }}>
        Click anywhere on the map to analyze location
      </div>
    </div>
  );
}
