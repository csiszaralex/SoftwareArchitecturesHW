'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth-store';
import { jwtDecode } from 'jwt-decode';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Definiáljuk, mi van a tokenben (Backend payload alapján)
interface DecodedToken {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name: string;
  picture?: string;
  exp: number;
}

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  
  const processed = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token && !processed.current) {
      processed.current = true;
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        const user = {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          role: decoded.role,
        };

        login(token, user);

        router.replace('/map');
      } catch (error) {
        console.error("Token feldolgozási hiba:", error);
        router.replace('/');
      }
    } else if (!token) {
      // router.replace('/'); // May cause redirect loop if not handled properly
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <p className="text-muted-foreground">Bejelentkezés folyamatban...</p>
    </div>
  );
}