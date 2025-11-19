import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useEndParking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/parking-sessions/end');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      toast.success('Parkolás sikeresen lezárva!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Hiba történt a lezáráskor.';
      toast.error(errorMessage);
    },
  });
}
