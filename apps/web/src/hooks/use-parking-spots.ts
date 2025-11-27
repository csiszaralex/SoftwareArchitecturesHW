import { api } from '@/lib/api';
import type { ParkingSpotResponse } from '@parking/schema';
import { SearchParkingSpotInput } from '@parking/schema';
import { useQuery } from '@tanstack/react-query';

export function useParkingSpots(params: SearchParkingSpotInput) {
  return useQuery({
    queryKey: ['parking-spots', params],

    queryFn: async () => {
      // Query paraméterek összeállítása
      const queryParams = new URLSearchParams();
      if (params.lat) queryParams.append('lat', params.lat.toString());
      if (params.lng) queryParams.append('lng', params.lng.toString());
      if (params.radius) queryParams.append('radius', params.radius.toString());
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
      if (params.category) queryParams.append('category', params.category);

      const { data } = await api.get<ParkingSpotResponse[]>(
        `/parking-spots?${queryParams.toString()}`,
      );
      return data;
    },
    enabled: true,
  });
}
