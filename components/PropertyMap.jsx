import React, { useEffect, useRef, useState } from 'react';

const PropertyMap = ({ property, nearbyFacilities }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sample coordinates for different cities
  const cityCoordinates = {
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.7041, lng: 77.1025 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'Jaipur': { lat: 26.9124, lng: 75.7873 },
    'Chandigarh': { lat: 30.7333, lng: 76.7794 },
    'Noida': { lat: 28.5355, lng: 77.3910 },
    'Gurgaon': { lat: 28.4595, lng: 77.0266 }
  };

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Get property coordinates based on city
        const propertyCoords = cityCoordinates[property.city] || cityCoordinates['Mumbai'];
        
        // Add small random offset for specific property location
        const propertyLocation = {
          lat: propertyCoords.lat + (Math.random() - 0.5) * 0.02,
          lng: propertyCoords.lng + (Math.random() - 0.5) * 0.02
        };

        // Check if MapLibre GL is available
        if (typeof window !== 'undefined' && window.maplibregl) {
          const map = new window.maplibregl.Map({
            container: mapRef.current,
            style: {
              "version": 8,
              "sources": {
                "osm": {
                  "type": "raster",
                  "tiles": ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                  "tileSize": 256,
                  "attribution": "© OpenStreetMap contributors"
                }
              },
              "layers": [{
                "id": "osm",
                "type": "raster",
                "source": "osm"
              }]
            },
            center: [propertyLocation.lng, propertyLocation.lat],
            zoom: 14
          });

          map.on('load', () => {
            setMapLoaded(true);
            
            // Add property marker
            new window.maplibregl.Marker({ color: '#ef4444' })
              .setLngLat([propertyLocation.lng, propertyLocation.lat])
              .setPopup(new window.maplibregl.Popup().setHTML(`
                <div style="padding: 8px;">
                  <h3 style="font-weight: 600; margin: 0 0 4px 0;">${property.title}</h3>
                  <p style="margin: 0; font-size: 14px; color: #666;">${property.location}</p>
                </div>
              `))
              .addTo(map);

            // Add nearby facilities markers
            const facilityIcons = {
              hospitals: '🏥',
              schools: '🏫', 
              transportation: '🚇',
              shopping: '🛒'
            };

            const facilityColors = {
              hospitals: '#dc2626',
              schools: '#2563eb', 
              transportation: '#16a34a',
              shopping: '#9333ea'
            };

            Object.entries(nearbyFacilities).forEach(([category, facilities]) => {
              facilities.forEach((facility, index) => {
                // Generate random nearby coordinates
                const facilityLocation = {
                  lat: propertyLocation.lat + (Math.random() - 0.5) * 0.015,
                  lng: propertyLocation.lng + (Math.random() - 0.5) * 0.015
                };

                // Create custom marker element
                const markerElement = document.createElement('div');
                markerElement.innerHTML = facilityIcons[category];
                markerElement.style.cssText = `
                  font-size: 18px;
                  background: ${facilityColors[category]};
                  border-radius: 50%;
                  width: 28px;
                  height: 28px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 2px solid white;
                  cursor: pointer;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                `;

                new window.maplibregl.Marker({ element: markerElement })
                  .setLngLat([facilityLocation.lng, facilityLocation.lat])
                  .setPopup(new window.maplibregl.Popup().setHTML(`
                    <div style="padding: 8px;">
                      <h4 style="font-weight: 600; margin: 0 0 4px 0;">${facility.name}</h4>
                      <p style="margin: 0 0 2px 0; font-size: 14px; color: #666;">${facility.distance}</p>
                      <p style="margin: 0; font-size: 12px; color: #999;">${category.charAt(0).toUpperCase() + category.slice(0, -1)}</p>
                    </div>
                  `))
                  .addTo(map);
              });
            });
          });

          map.on('error', (e) => {
            console.error('Map error:', e);
            setMapError(true);
          });

          mapInstance.current = map;
        } else {
          setMapError(true);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    };

    // Load MapLibre GL JS
    const loadMapLibre = () => {
      if (window.maplibregl) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js';
      script.onload = () => {
        const style = document.createElement('link');
        style.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
        style.rel = 'stylesheet';
        document.head.appendChild(style);
        
        setTimeout(initializeMap, 100);
      };
      script.onerror = () => setMapError(true);
      document.head.appendChild(script);
    };

    loadMapLibre();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [property, nearbyFacilities]);

  if (mapError) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 0 1 6 0z" />
            </svg>
            Location & Nearby Amenities
          </h3>
          <p className="text-gray-600 text-sm mt-1">{property.location}</p>
        </div>
        
        <div className="flex items-center justify-center h-96 bg-gray-50">
          <div className="text-center p-6">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 0 1 6 0z" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h4>
            <p className="text-gray-600 mb-1">{property.location}</p>
            <p className="text-sm text-gray-500">Property location in {property.city}</p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50">
          <h4 className="text-sm font-semibold mb-2">Nearby Facilities Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>🏥 Healthcare: {nearbyFacilities.hospitals?.length || 0} facilities</div>
            <div>🏫 Education: {nearbyFacilities.schools?.length || 0} facilities</div>
            <div>🚇 Transport: {nearbyFacilities.transportation?.length || 0} facilities</div>
            <div>🛒 Shopping: {nearbyFacilities.shopping?.length || 0} facilities</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 0 1 6 0z" />
          </svg>
          Location & Nearby Amenities
        </h3>
        <p className="text-gray-600 text-sm mt-1">{property.location}</p>
      </div>
      
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-96"
          style={{ minHeight: '400px' }}
        />
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading interactive map...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="p-4 bg-gray-50">
        <h4 className="text-sm font-semibold mb-2">Map Legend</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Property Location</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">🏥</div>
            <span>Healthcare</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">🏫</div>
            <span>Education</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">🚇</div>
            <span>Transport</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">🛒</div>
            <span>Shopping</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
