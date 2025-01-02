'use client';

import * as React from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap
} from '@vis.gl/react-google-maps';
import { GpsCoordinate } from './IncidentsTab';

// Create a separate component for the polyline
const PathPolyline = ({ path }: { path: google.maps.LatLngLiteral[] }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!map) return;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor: '#4A5568',
      strokeOpacity: 0.8,
      strokeWeight: 3
    });

    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, [map, path]);

  return null;
};

interface IncidentMapProps {
  coordinates: GpsCoordinate[];
  height?: string;
}

const IncidentMap = ({ coordinates, height = '200px' }: IncidentMapProps) => {
  const center = React.useMemo(() => {
    if (coordinates.length === 0) return { lat: 0, lng: 0 };
    return {
      lat: coordinates[0].latitude,
      lng: coordinates[0].longitude
    };
  }, [coordinates]);

  const path = React.useMemo(() => {
    return coordinates.map((coord) => ({
      lat: coord.latitude,
      lng: coord.longitude
    }));
  }, [coordinates]);

  return (
    <div style={{ height: '200px', width: '100%' }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          zoom={16}
          center={center}
          gestureHandling="greedy"
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          {coordinates.map((coord, index) => (
            <AdvancedMarker
              key={coord.id}
              position={{ lat: coord.latitude, lng: coord.longitude }}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                {index + 1}
              </div>
            </AdvancedMarker>
          ))}
          <PathPolyline path={path} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default IncidentMap;
