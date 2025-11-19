'use client';

import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map/mapbox-map'), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-full w-full rounded-xl bg-muted/50 animate-pulse flex items-center justify-center">
      <span className="text-muted-foreground">Térkép betöltése...</span>
    </Skeleton>
  ),
});

export default function MapPage() {
  return (
    // JAVÍTÁS: Nem calc(), hanem flex-grow.
    // A 'min-h-0' trükk fontos flex childoknál, hogy ne lógjon túl!
    <div className="flex-1 min-h-0 w-full rounded-xl overflow-hidden border border-border relative">
      <Map />
    </div>
  );
}
