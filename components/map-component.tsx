'use client';

import { useEffect, useRef } from 'react';

interface MapComponentProps {
  location: { lat: number; lng: number };
  showLandmarks?: boolean;
}

export default function MapComponent({ location, showLandmarks = false }: MapComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // To store the Leaflet map instance

  useEffect(() => {
    // If the container doesn't exist yet, do nothing
    if (!containerRef.current) return;

    const loadMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!containerRef.current) return;

      // FIX: Check if the map is already initialized on this DOM element
      // Leaflet adds a '_leaflet_id' property to the container once initialized
      if ((containerRef.current as any)._leaflet_id && mapInstanceRef.current) {
        // If it exists, just update the view instead of re-creating
        mapInstanceRef.current.setView([location.lat, location.lng], 14);
        return;
      }

      // Initialize the map and store it in the ref
      const map = L.map(containerRef.current).setView([location.lat, location.lng], 14);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // User location marker
      const userIcon = L.divIcon({
        html: '<div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4); font-size: 20px;">📍</div>',
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -10],
      });

      L.marker([location.lat, location.lng], { icon: userIcon })
        .bindPopup('<strong>Your Location</strong><br/>You are here')
        .addTo(map);

      if (showLandmarks) {
        const landmarks = [
          { lat: location.lat + 0.01, lng: location.lng + 0.01, name: 'Central Police Station', type: 'police', icon: '🚨', color: '#3b82f6' },
          { lat: location.lat - 0.015, lng: location.lng + 0.012, name: 'City Medical Center', type: 'hospital', icon: '🏥', color: '#ef4444' },
          { lat: location.lat + 0.008, lng: location.lng - 0.015, name: 'Fire Station 5', type: 'fire', icon: '🔥', color: '#f59e0b' },
        ];

        landmarks.forEach((landmark) => {
          const icon = L.divIcon({
            html: `<div style="background: ${landmark.color}; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); font-size: 18px;">${landmark.icon}</div>`,
            className: '',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -10],
          });

          L.marker([landmark.lat, landmark.lng], { icon })
            .bindPopup(`<strong>${landmark.name}</strong><br/><small>Type: ${landmark.type}</small><br/><small>Distance: ~${(Math.random() * 2 + 0.5).toFixed(1)} km</small>`)
            .addTo(map);
        });
      }
    };

    loadMap();

    // CLEANUP: Remove the map instance when the component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location.lat, location.lng, showLandmarks]); 
  // Dependency note: use specific lat/lng to prevent unnecessary re-runs if the object reference changes

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '400px', minHeight: '300px' }} 
      className="rounded-lg shadow-inner bg-slate-100" 
    />
  );
}