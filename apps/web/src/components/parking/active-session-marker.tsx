'use client';

import { useActiveSession } from '@/hooks/use-active-session';
import { CarFront } from 'lucide-react';
import { Marker } from 'react-map-gl/mapbox';

export function ActiveSessionMarker() {
  const { data: session } = useActiveSession();

  if (!session?.isActive) return null;

  return (
    <Marker latitude={session.lat} longitude={session.lng} anchor="bottom">
      <div className="relative flex flex-col items-center justify-center cursor-pointer group">
        {/* Pulsáló háttér, hogy feltűnő legyen */}
        <span className="absolute w-12 h-12 bg-blue-500 rounded-full opacity-20 animate-ping" />

        {/* Ikon */}
        <div className="relative z-10 bg-blue-600 text-white p-2 rounded-full shadow-xl border-2 border-white transform transition-transform group-hover:scale-110 group-hover:-translate-y-1">
          <CarFront className="w-6 h-6" />
        </div>

        {/* Label */}
        <div className="absolute -top-8 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm border whitespace-nowrap">
          Itt állsz
        </div>

        {/* "Szár" a marker alján */}
        <div className="w-0.5 h-3 bg-blue-600 -mt-0.5" />
      </div>
    </Marker>
  );
}
