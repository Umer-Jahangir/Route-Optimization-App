import React, { useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AutocompleteInput from './AutocompleteInput';
import Navbar from './navBar';

const API_URL = 'http://localhost:8000/api/optimize-route/';

export default function RouteOptimizer() {
  const [startLocation, setStartLocation] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [distances, setDistances] = useState([]);
  const [durations, setDurations] = useState([]); 
  const [drivers, setDrivers] = useState(1);
  const [loading, setLoading] = useState(false);

  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const colors = ['blue', 'green', 'orange', 'purple', 'red', 'teal', 'black'];

  const handleSubmit = async () => {
    if (!startLocation) {
      alert('Start location is required.');
      return;
    }

    const allLocations = [startLocation, ...waypoints]; // depot + stops

    if (allLocations.length < 2) {
      alert('At least one waypoint is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: allLocations, drivers }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || 'Failed to optimize route');
        return;
      }

      setRoutes(data.routes || []);
      setDistances(data.distances || []);
      setDurations(data.durations_seconds || []);
    } catch (error) {
      console.error('Request error:', error);
      alert('Failed to connect to backend.');
      setLoading(false);
    }
  };

  const removeWaypoint = (index) => {
    const newWaypoints = [...waypoints];
    newWaypoints.splice(index, 1);
    setWaypoints(newWaypoints);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px', backgroundColor: '#f8f9fa', padding: '2px', marginLeft: '-10px', height: '100vh' }}>
        <Navbar />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginTop: '20px', marginLeft: '20px' }}>
        <MapContainer
          center={[31.5204, 74.3587]}
          zoom={13}
          style={{ height: '500px', width: '76vw' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {startLocation && (
            <Marker
              position={[startLocation.lat, startLocation.lng]}
              icon={L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              })}
            />
          )}
          {waypoints.map((loc, idx) => (
            <Marker key={`wp-${idx}`} position={[loc.lat, loc.lng]} icon={greenIcon} />
          ))}
          {routes.map((driverRoute, idx) => (
            <Polyline
              key={`route-${idx}`}
              positions={driverRoute}
              pathOptions={{
                color: colors[idx % colors.length],
                weight: 4,
                opacity: 0.6,
                lineCap: 'round',
              }}
            />
          ))}
        </MapContainer>

        <div style={{ marginTop: '20px' }}>
          <AutocompleteInput placeholder="Enter START location (Depot)" onSelect={setStartLocation} />
          <AutocompleteInput
            placeholder="Add Waypoint"
            onSelect={(loc) => setWaypoints([...waypoints, loc])}
          />

          {waypoints.length > 0 && (
            <div style={{ marginTop: '10px', backgroundColor: '#eaf4fc', padding: '10px', borderRadius: '6px' }}>
              <strong>Waypoints:</strong>
              <ul>
                {waypoints.map((loc, idx) => (
                  <li key={`point-${idx}`}>
                    Lat: {loc.lat.toFixed(5)}, Lng: {loc.lng.toFixed(5)}{' '}
                    <button
                      onClick={() => removeWaypoint(idx)}
                      style={{ color: 'red', border: 'none', background: 'none' }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={() => setWaypoints([])} className="btn btn-outline-danger btn-sm mt-1">
                Clear All Waypoints
              </button>
            </div>
          )}

          <input
            type="number"
            min="1"
            placeholder="Number of drivers"
            value={drivers}
            onChange={(e) => setDrivers(Number(e.target.value))}
            className="form-control my-2"
          />
          <button onClick={handleSubmit} disabled={loading} className="btn btn-primary">
            {loading ? 'Optimizing...' : 'Optimize Route'}
          </button>
          {distances.map((dist, idx) => {
            const dur = durations[idx] || 0;
            const durMin = Math.round(dur / 60);
            return dist > 10 ? (
              <li key={`dist-${idx}`}>
                Driver {idx + 1}: {(dist / 1000).toFixed(2)} km, {durMin} min
              </li>
            ) : (
              <li key={`dist-${idx}`} style={{ color: 'gray' }}>
                Driver {idx + 1}: No route assigned
              </li>
            );
          })}
        </div>
      </div>
    </div>
  );
}
