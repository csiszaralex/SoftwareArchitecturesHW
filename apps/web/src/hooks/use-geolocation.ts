import { useEffect, useState } from 'react';

const BUDAPEST_CENTER = { lat: 47.4979, lng: 19.0402 };

export function useGeolocation() {
  const isGeoAvailable = typeof window !== 'undefined' && 'geolocation' in navigator;

  const [location, setLocation] = useState({
    ...BUDAPEST_CENTER,
    isReady: !isGeoAvailable,
    isAvailable: isGeoAvailable,
    error: null as string | null,
  });

  useEffect(() => {
    if (!isGeoAvailable) {
      // setLocation(s => ({
      //   ...s,
      //   isReady: true,
      //   error: 'A böngésző nem támogatja a helymeghatározást.',
      // }));
      return;
    }

    const success = (pos: GeolocationPosition) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        isReady: true,
        isAvailable: true,
        error: null,
      });
    };

    const error = (err: GeolocationPositionError) => {
      let msg = 'Ismeretlen GPS hiba.';
      if (err.code === 1) msg = 'A helymeghatározás engedélye megtagadva.';
      if (err.code === 2) msg = 'A hely nem érhető el.';
      if (err.code === 3) msg = 'Időtúllépés a helymeghatározásnál.';

      setLocation(prev => ({ ...prev, isReady: true, isAvailable: false, error: msg }));
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
