'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setToken = useAuthStore(state => state.setToken);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // 1. Token mentése a store-ba (és sütibe)
      setToken(token);

      // 2. Továbbdobás a térképre (vagy ahonnan jött)
      router.replace('/map');
    } else {
      // Ha nincs token, vissza a főoldalra
      router.replace('/');
    }
  }, [searchParams, setToken, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <p className="text-muted-foreground">Bejelentkezés folyamatban...</p>
    </div>
  );
}
