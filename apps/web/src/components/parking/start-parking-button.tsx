'use client';

import { Button } from '@/components/ui/button';
import { useActiveSession } from '@/hooks/use-active-session';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useStartParking } from '@/hooks/use-start-parking';
import { Car, Loader2, MapPinOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StartParkingButton() {
  const { mutate, isPending } = useStartParking();
  const {
    data: activeSession,
    isLoading: isLoadingSession,
    isError: isSessionError,
  } = useActiveSession();
  const location = useGeolocation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (activeSession?.isActive || !isMounted) {
    return null;
  }
  if (isLoadingSession || !location.isReady || isSessionError) {
    if (isSessionError) {
      return (
        <div className="absolute top-4 left-4 z-40 bg-red-500/90 text-white p-2 rounded-md shadow-lg">
          Backend hiba!
        </div>
      );
    }
    return (
      <div className="absolute top-4 left-4 z-40">
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Helyzet ellenőrzése...
        </Button>
      </div>
    );
  }
  if (!location.isAvailable) {
    return (
      <div className="absolute top-4 right-4 z-40 flex flex-col items-end">
        <Button disabled variant="destructive" className="shadow-lg">
          <MapPinOff className="mr-2 h-4 w-4" />
          GPS helyzet ismeretlen
        </Button>
        <p className="text-xs text-muted-foreground mt-1 bg-background/70 backdrop-blur-sm px-2 py-0.5 rounded">
          Kérem engedélyezze a GPS-t.
        </p>
      </div>
    );
  }

  const handleStartParking = () => {
    mutate({
      lat: location.lat,
      lng: location.lng,
      address: 'Aktuális GPS helyzet (Reverse Geocode hiányzik)',
      endsAt: new Date(Date.now() + 60 * 60 * 1000),
    });
  };

  return (
    <div className="absolute bottom-4 right-4 z-40 flex flex-col items-end">
      <Button
        onClick={handleStartParking}
        disabled={isPending}
        className="shadow-xl bg-green-600 hover:bg-green-700 text-white h-14 w-14 rounded-full text-lg p-0" // FAB stílus
      >
        {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Car className="h-6 w-6" />}
      </Button>
    </div>
  );
}
