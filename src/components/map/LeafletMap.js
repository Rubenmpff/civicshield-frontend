import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createCustomIcon = (color, size = 30) =>
  L.divIcon({
    className: "custom-div-icon",
    html: `<div style="
      background:${color};
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 4px 12px rgba(0,0,0,0.25);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const helpRequestIcon = (priority) => {
  const colors = {
    high: "#ef4444",
    medium: "#f97316",
    low: "#eab308",
  };

  return createCustomIcon(colors[priority] || colors.medium);
};

const volunteerIcon = createCustomIcon("#1e40af");

const getRequestCoords = (request) => {
  if (request?.location?.lat && request?.location?.lng) {
    return {
      lat: request.location.lat,
      lng: request.location.lng,
    };
  }

  if (request?.latitude && request?.longitude) {
    return {
      lat: request.latitude,
      lng: request.longitude,
    };
  }

  return null;
};

const getVolunteerCoords = (volunteer) => {
  if (volunteer?.location?.lat && volunteer?.location?.lng) {
    return {
      lat: volunteer.location.lat,
      lng: volunteer.location.lng,
    };
  }

  if (volunteer?.latitude && volunteer?.longitude) {
    return {
      lat: volunteer.latitude,
      lng: volunteer.longitude,
    };
  }

  return null;
};

const MapBoundsUpdater = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers, map]);

  return null;
};

const LeafletMap = ({
  helpRequests = [],
  volunteers = [],
  center = [41.1579, -8.6291],
  zoom = 12,
  height = "100%",
  showLegend = true,
}) => {
  const allMarkers = [
    ...helpRequests
      .map((request) => getRequestCoords(request))
      .filter(Boolean),
    ...volunteers
      .map((volunteer) => getVolunteerCoords(volunteer))
      .filter(Boolean),
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {allMarkers.length > 0 && <MapBoundsUpdater markers={allMarkers} />}

        {helpRequests.map((request) => {
          const coords = getRequestCoords(request);

          if (!coords) return null;

          return (
            <Marker
              key={`request-${request.id}`}
              position={[coords.lat, coords.lng]}
              icon={helpRequestIcon(request.priority)}
            >
              <Popup>
                <div className="min-w-[200px] p-2">
                  <h3 className="mb-1 font-semibold text-slate-900">
                    {request.title}
                  </h3>

                  <p className="mb-2 text-sm text-slate-600">
                    {request.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        request.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : request.priority === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {request.priority === "high"
                        ? "Alta"
                        : request.priority === "medium"
                        ? "Média"
                        : "Baixa"}
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        request.status === "pending"
                          ? "bg-slate-100 text-slate-700"
                          : request.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {request.status === "pending"
                        ? "Pendente"
                        : request.status === "in_progress"
                        ? "Em curso"
                        : "Concluído"}
                    </span>
                  </div>

                  {request.address && (
                    <p className="mt-2 text-xs text-slate-500">
                      {request.address}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {volunteers.map((volunteer) => {
          const coords = getVolunteerCoords(volunteer);

          if (!coords) return null;

          return (
            <Marker
              key={`volunteer-${volunteer.id}`}
              position={[coords.lat, coords.lng]}
              icon={volunteerIcon}
            >
              <Popup>
                <div className="min-w-[180px] p-2">
                  <h3 className="mb-1 font-semibold text-slate-900">
                    {volunteer.name}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      volunteer.status === "available"
                        ? "bg-emerald-100 text-emerald-700"
                        : volunteer.status === "on_mission"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {volunteer.status === "available"
                      ? "Disponível"
                      : volunteer.status === "on_mission"
                      ? "Em missão"
                      : "Offline"}
                  </span>

                  {volunteer.missions_completed > 0 && (
                    <p className="mt-2 text-xs text-slate-500">
                      {volunteer.missions_completed} missões concluídas
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {showLegend && (
        <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <p className="mb-2 text-xs font-semibold text-slate-700">Legenda</p>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-slate-600">Alta prioridade</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span className="text-xs text-slate-600">Média prioridade</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-slate-600">Baixa prioridade</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-800"></div>
              <span className="text-xs text-slate-600">Voluntário</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeafletMap;