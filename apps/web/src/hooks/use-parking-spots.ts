import { api } from '@/lib/api';
import type { ParkingSpotResponse } from '@parking/schema';
import { useQuery } from '@tanstack/react-query';

interface SearchParams {
  lat?: number;
  lng?: number;
  radius?: number;
}

export function useParkingSpots(params?: SearchParams) {
  return useQuery({
    // A kulcs tartalmazza a paramétereket, így ha azok változnak, a React Query újrafetchel
    queryKey: ['parking-spots', params],

    queryFn: async () => {
      // Query paraméterek összeállítása
      const queryParams = new URLSearchParams();
      if (params?.lat) queryParams.append('lat', params.lat.toString());
      if (params?.lng) queryParams.append('lng', params.lng.toString());
      if (params?.radius) queryParams.append('radius', params.radius.toString());

      // Itt történik a hívás a backend felé
      // A <ParkingSpotResponse[]> megmondja a TS-nek, mit várunk vissza
      const { data } = await api.get<ParkingSpotResponse[]>(
        `/parking-spots?${queryParams.toString()}`,
      );
      return data;
    },
  });
}
