'use client';

import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  MarkerDragEvent,
  NavigationControl,
} from 'react-map-gl/mapbox';

interface LocationPickerProps {
  value: { lat: number; lng: number };
  onChange: (value: { lat: number; lng: number }) => void;
}

const INITIAL_VIEW_STATE = {
  latitude: 47.4979,
  longitude: 19.0402,
  zoom: 13,
};

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const { resolvedTheme } = useTheme();

  const mapRef = useRef<MapRef>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const markerPos = value || { lat: 47.4979, lng: 19.0402 };
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = mapContainerRef.current;
    if (!currentContainer) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
        mapRef.current.jumpTo({ center: [value.lng, value.lat] });
      }
    });

    resizeObserver.observe(currentContainer);
    return () => resizeObserver.disconnect();
  }, [value.lng, value.lat]); // Figyeljük a koordinátát is

  useEffect(() => {
    if (isMapLoaded && mapRef.current) {
      mapRef.current.flyTo({
        center: [value.lng, value.lat],
        zoom: 15,
        duration: 1000,
        essential: true,
      });
    }
  }, [value.lat, value.lng, isMapLoaded]);

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
    <div
      ref={mapContainerRef}
      className="h-[300px] w-full rounded-md overflow-hidden border relative">
      <Map
        {...viewState}
        ref={mapRef}
        onLoad={() => {
          setIsMapLoaded(true);
          setTimeout(() => {
            mapRef.current?.resize();
            mapRef.current?.flyTo({ center: [value.lng, value.lat], zoom: 15, duration: 0 });
          }, 100);
        }}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        reuseMaps
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
