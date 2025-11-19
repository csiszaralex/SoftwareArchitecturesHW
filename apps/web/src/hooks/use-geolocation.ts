import { useEffect, useState } from 'react';

const BUDAPEST_CENTER = { lat: 47.4979, lng: 19.0402 };

export function useGeolocation() {
  const isGeoAvailable = typeof window !== 'undefined' && 'geolocation' in navigator;

  const [location, setLocation] = useState({
    ...BUDAPEST_CENTER,
    isReady: !isGeoAvailable,
    isAvailable: isGeoAvailable,
  });

  useEffect(() => {
    if (!isGeoAvailable) {
      return;
    }

    const success = (pos: GeolocationPosition) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        isReady: true,
        isAvailable: true,
      });
    };

    const error = (_err: GeolocationPositionError) => {
      setLocation(prev => ({ ...prev, isReady: true, isAvailable: false }));
    };

    const watchId = navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isGeoAvailable]);

  return location;
}
