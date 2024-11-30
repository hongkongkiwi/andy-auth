'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FilterBar } from './FilterBar';
import { useState } from 'react';

const defaultCenter = {
  lat: -3.745,
  lng: -38.523
};

type Location = {
  id: string;
  lat: number;
  lng: number;
  // Add other location properties
};

type ClientLocationMapProps = {
  searchParams: {
    category?: string | null;
    status?: string | null;
  };
};

// Define constants
const DEFAULT_ZOOM = 10;
const DEFAULT_FILTER = 'all';

type Filters = {
  category: string;
  status: string;
};

// Use the Filters type
const ClientLocationMap = ({ searchParams }: ClientLocationMapProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filters, setFilters] = useState<Filters>({
    category: searchParams.category ?? DEFAULT_FILTER,
    status: searchParams.status ?? DEFAULT_FILTER,
  });

  // Move handler outside JSX for better readability
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setLocations([]);
    // Use setLocations
    // TODO: Fetch new locations based on filters
    // Example: fetchLocations(newFilters).then(setLocations);
  };

  return (
    <div className="h-screen flex flex-col">
      <FilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange}
      />
      
      <div className="flex-1">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={defaultCenter}
            zoom={DEFAULT_ZOOM}
          >
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={{ lat: location.lat, lng: location.lng }}
                // Add onClick handler for marker details
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default ClientLocationMap; 