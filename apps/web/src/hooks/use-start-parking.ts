import { api } from '@/lib/api';
import { StartParkingInput } from '@parking/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useStartParking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StartParkingInput) => {
      const { data: responseData } = await api.post('/parking-sessions/start', data);
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      toast.success('Parkolás elindítva!', {
        description: 'Az időmérő elindult. Ne felejtsd el lezárni a parkolást!',
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Hiba történt a parkolás indításakor.';
      toast.error(errorMessage);
    },
  });
}
