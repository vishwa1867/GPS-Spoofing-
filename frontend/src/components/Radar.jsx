import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import "../styles/radar.css";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const LiveMap = () => {
  const [location, setLocation] = useState(null);
  const [signals, setSignals] = useState([]);
  const [angle, setAngle] = useState(0);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  });

  // Get real location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(center);

        // Create fake nearby signals with angles
        const fakeSignals = Array.from({ length: 6 }, () => ({
          angle: Math.random() * 360,
          distance: 120 + Math.random() * 40,
          id: Math.random(),
        }));

        setSignals(fakeSignals);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);

  // Radar rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 2) % 360);
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

      {/* RADAR OVERLAY */}
      <div className="radar-overlay">
        <div
          className="radar"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="scan-line"></div>
          <div className="center-dot"></div>

          {signals.map((s) => {
            const diff = Math.abs(angle - s.angle);
            const visible = diff < 6 || diff > 354;

          const dx = (s.lng - location.lng) * 111111;
const dy = (s.lat - location.lat) * 111111;

const x = dx;
const y = -dy;


            return (
              <div
                key={s.id}
                className={`signal-dot ${visible ? "active" : ""}`}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              />
            );
          })}
        </div>

        <div className="radar-text">
          ACTIVE GPS SIGNAL SWEEP
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
