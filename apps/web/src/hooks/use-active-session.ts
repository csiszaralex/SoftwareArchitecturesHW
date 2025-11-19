import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { ParkingSessionResponse } from '@parking/schema';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export function useActiveSession() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['active-session'],
    enabled: isAuthenticated,
    queryFn: async () => {
      try {
        const { data } = await api.get<ParkingSessionResponse>('/parking-sessions/active');
        return data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });
}
