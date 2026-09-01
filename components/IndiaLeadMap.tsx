"use client";

import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { DashboardLead } from "./LeadDashboard";

type Props = {
  leads: DashboardLead[];
  selectedLead: DashboardLead | null;
  onSelectCity(city: string): void;
};

function Focus({ lead }: { lead: DashboardLead | null }) {
  const map = useMap();
  if (lead?.coordinates) map.flyTo([lead.coordinates.latitude, lead.coordinates.longitude], 11, { duration: 0.5 });
  return null;
}

export default function IndiaLeadMap({ leads, selectedLead, onSelectCity }: Props) {
  const cities = new Map<string, { city: string; latitude: number; longitude: number; count: number }>();
  for (const lead of leads) {
    if (!lead.city || !lead.coordinates) continue;
    const current = cities.get(lead.city);
    cities.set(lead.city, current
      ? { ...current, count: current.count + 1 }
      : { city: lead.city, latitude: lead.coordinates.latitude, longitude: lead.coordinates.longitude, count: 1 });
  }

  return (
    <div className="h-[430px] overflow-hidden rounded-xl border border-white/10">
      <MapContainer center={[22.5937, 78.9629]} zoom={4} minZoom={4} maxZoom={18} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Focus lead={selectedLead} />
        {[...cities.values()].map((city) => (
          <CircleMarker key={city.city} center={[city.latitude, city.longitude]} radius={Math.min(8 + city.count * 2, 22)} pathOptions={{ color: "#3E86F5", fillColor: "#3E86F5", fillOpacity: 0.75 }} eventHandlers={{ click: () => onSelectCity(city.city) }}>
            <Popup><strong>{city.city}</strong><br />{city.count} lead{city.count === 1 ? "" : "s"}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
