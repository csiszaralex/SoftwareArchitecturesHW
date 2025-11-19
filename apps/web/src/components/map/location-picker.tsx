'use client';

import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from 'next-themes';
import { useCallback, useState } from 'react';
import Map, {
  GeolocateControl,
  Marker,
  MarkerDragEvent,
  NavigationControl,
} from 'react-map-gl/mapbox';

interface LocationPickerProps {
  value?: { lat: number; lng: number };
  onChange: (value: { lat: number; lng: number }) => void;
}

const INITIAL_VIEW_STATE = {
  latitude: 47.4979,
  longitude: 19.0402,
  zoom: 13,
};

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const { resolvedTheme } = useTheme();

  // Ha nincs érték, Budapest közepét mutatjuk, de markert nem (vagy tehetünk defaultot)
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  // A marker pozíciója (alapból Budapest közepe, ha üres)
  const markerPos = value || { lat: 47.4979, lng: 19.0402 };

  const onMarkerDragEnd = useCallback(
    (event: MarkerDragEvent) => {
      const { lng, lat } = event.lngLat;
      onChange({ lat, lng });
    },
    [onChange],
  );

  const mapStyle =
    resolvedTheme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/streets-v12';

  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}>
        <NavigationControl position="top-left" />
        <GeolocateControl position="top-left" />

        <Marker
          latitude={markerPos.lat}
          longitude={markerPos.lng}
          draggable
          onDragEnd={onMarkerDragEnd}
          anchor="bottom">
          <div className="relative flex items-center justify-center w-8 h-8 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
            <MapPin className="w-10 h-10 text-primary fill-primary drop-shadow-xl" />
            <span className="absolute -top-8 bg-background px-2 py-1 rounded text-xs font-bold shadow-sm border">
              Húzz ide!
            </span>
          </div>
        </Marker>
      </Map>

      <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur p-2 rounded text-xs shadow border">
        Lat: {markerPos.lat.toFixed(4)}, Lng: {markerPos.lng.toFixed(4)}
      </div>
    </div>
  );
}
