'use client';

import { ActiveSessionOverlay } from '@/components/parking/active-session-overlay';
import { AddParkingDialog } from '@/components/parking/add-parking-dialog';
import { SearchAndFilterBar } from '@/components/parking/search-and-filter-bar';
import { StartParkingDialog } from '@/components/parking/start-parking-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useParkingSpots } from '@/hooks/use-parking-spots';
import { SearchParkingSpotInput } from '@parking/schema';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const Map = dynamic(() => import('@/components/map/mapbox-map'), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-full w-full rounded-xl bg-muted/50 animate-pulse flex items-center justify-center">
      <span className="text-muted-foreground">Térkép betöltése...</span>
    </Skeleton>
  ),
});

export default function MapPage() {
  const [searchParams, setSearchParams] = useState<SearchParkingSpotInput>({
    lat: 47.4979, // Kezdeti középpont
    lng: 19.0402,
    radius: 5000, // Kezdeti 5 km
    searchTerm: undefined,
    category: undefined,
  });
  const location = useGeolocation();

  const hasCenteredRef = useRef(false);
  useEffect(() => {
    if (location.isReady && location.isAvailable && !hasCenteredRef.current) {
      setTimeout(() => {
        setSearchParams(prev => ({
          ...prev,
          lat: location.lat,
          lng: location.lng,
        }));
        hasCenteredRef.current = true;
      }, 0);
    }
  }, [location.isReady, location.isAvailable, location.lat, location.lng]);

  const { data: spots, isLoading, isError } = useParkingSpots(searchParams);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMapMoveEnd = (viewState: any) => {
    setSearchParams(prev => ({
      ...prev,
      lat: viewState.viewState.latitude,
      lng: viewState.viewState.longitude,
    }));
  };

  const handleSearchChange = (update: Partial<SearchParkingSpotInput>) => {
    setSearchParams(prev => ({ ...prev, ...update }));
  };

  return (
    <div className="flex-1 min-h-0 w-full rounded-xl overflow-hidden border border-border relative">
      <SearchAndFilterBar searchState={searchParams} onSearchChange={handleSearchChange} />

      <div className="absolute top-4 right-4 z-40">
        <AddParkingDialog />
      </div>

      <Map
        spots={spots}
        isLoading={isLoading}
        onMoveEnd={handleMapMoveEnd}
        userLocation={location.isAvailable ? { lat: location.lat, lng: location.lng } : null}
      />
      <ActiveSessionOverlay />
      <StartParkingDialog />
    </div>
  );
}
