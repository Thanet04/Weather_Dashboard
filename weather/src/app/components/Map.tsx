"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  lat: number;
  lon: number;
  name: string;
  description: string;
}

export default function Map({ lat, lon, name, description }: MapProps) {
  return (
    <MapContainer
      key={lat + lon}
      center={[lat, lon] as [number, number]}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%", zIndex: 10, position: "relative" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />
      <Marker position={[lat, lon]} icon={markerIcon}>
        <Popup>
          {name} <br /> {description}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
