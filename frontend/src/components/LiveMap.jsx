import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import "../styles/radar.css";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

// Fake spoofed location (can be changed later)
const SPOOF_LOCATION = {
  lat: 17.5453,
  lng: 78.5718,
};

const LiveMap = () => {
  const [realLocation, setRealLocation] = useState(null);
  const [useSpoof, setUseSpoof] = useState(false);
  const [signals, setSignals] = useState([]);
  const [angle, setAngle] = useState(0);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  });

  // Get REAL GPS
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setRealLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);

  const location = useSpoof ? SPOOF_LOCATION : realLocation;

  // Generate nearby GPS signals
  useEffect(() => {
    if (!location) return;

    const generated = Array.from({ length: 6 }, () => {
      const distance = 40 + Math.random() * 120;
      const bearing = Math.random() * 360;

      const latOffset =
        (distance * Math.cos((bearing * Math.PI) / 180)) / 111111;
      const lngOffset =
        (distance * Math.sin((bearing * Math.PI) / 180)) /
        (111111 * Math.cos(location.lat * Math.PI / 180));

      return {
        lat: location.lat + latOffset,
        lng: location.lng + lngOffset,
        bearing,
        distance,
        id: Math.random(),
      };
    });

    setSignals(generated);
  }, [location]);

  // Radar rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((a) => (a + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  if (!isLoaded || !location) return <p>Loading...</p>;

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={18}
        options={{
          disableDefaultUI: true,
          mapTypeId: "satellite",
        }}
      >
        <Marker position={location} />
      </GoogleMap>

      {/* Toggle Panel */}
      <div className="control-panel">
        <h3>GPS MODE</h3>
        <button onClick={() => setUseSpoof(false)}>REAL</button>
        <button onClick={() => setUseSpoof(true)}>SPOOF</button>
        <p>{useSpoof ? "⚠️ SPOOF ACTIVE" : "🛰️ REAL GPS"}</p>
      </div>

      {/* Radar */}
      <div className="radar-overlay">
        <div className="radar">
          <div
            className="scan-line"
            style={{ transform: `rotate(${angle}deg)` }}
          ></div>

          <div className="center-dot"></div>

          {signals.map((s) => {
            const dx = (s.lng - location.lng) * 111111;
            const dy = (s.lat - location.lat) * 111111;

            const diff = Math.abs(angle - s.bearing);
            const visible = diff < 6 || diff > 354;

            return (
              <div
                key={s.id}
                className={`signal-dot ${visible ? "active" : ""}`}
                style={{
                  transform: `translate(${dx}px, ${-dy}px)`,
                }}
              >
                <span
                  className="signal-ring"
                  style={{ animationDuration: `${1 + s.distance / 60}s` }}
                ></span>
              </div>
            );
          })}
        </div>

        <div className="radar-text">
          {useSpoof ? "GPS SPOOFING ENABLED" : "REAL SIGNAL SCAN"}
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
