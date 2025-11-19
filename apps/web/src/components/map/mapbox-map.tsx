'use client';

import { useParkingSpots } from '@/hooks/use-parking-spots';
import type { ParkingSpotResponse } from '@parking/schema';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from 'next-themes';
import * as React from 'react';
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
  Popup,
} from 'react-map-gl/mapbox';

const INITIAL_VIEW_STATE = {
  //TODO: Ezt később a felhasználó helyéhez igazíthatjuk
  latitude: 47.4979,
  longitude: 19.0402,
  zoom: 12,
  bearing: 0,
  pitch: 0,
};

export default function MapboxMap() {
  const { resolvedTheme } = useTheme();

  // Referenciák az átméretezéshez
  const mapRef = React.useRef<MapRef>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);

  const { data: spots, isLoading, isError } = useParkingSpots();
  const [popupInfo, setPopupInfo] = React.useState<ParkingSpotResponse | null>(null);

  // ResizeObserver: Figyeli a Sidebar csukódását és frissíti a térképet
  React.useEffect(() => {
    const currentContainer = mapContainerRef.current;
    if (!currentContainer) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });

    resizeObserver.observe(currentContainer);

    return () => resizeObserver.disconnect();
  }, []);

  const mapStyle =
    resolvedTheme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/streets-v12';

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full rounded-xl overflow-hidden border border-border shadow-sm relative">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle={mapStyle}
        attributionControl={false}
        reuseMaps>
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" showCompass={true} />

        {/* Valódi adatok renderelése */}
        {spots?.map(spot => (
          <Marker
            key={spot.id}
            latitude={spot.lat}
            longitude={spot.lng}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(spot);
            }}>
            <div className="relative flex items-center justify-center w-8 h-8 cursor-pointer transition-transform hover:scale-110 group">
              {/* Itt színezhetnénk kategória alapján is (pl. Ingyenes = Zöld) */}
              <MapPin className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-lg group-hover:text-red-600" />
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            latitude={popupInfo.lat}
            longitude={popupInfo.lng}
            onClose={() => setPopupInfo(null)}
            className="text-black"
            closeButton={false}
            offset={10}>
            <div className="p-3 min-w-[180px]">
              <h3 className="font-bold text-sm mb-1">{popupInfo.name}</h3>

              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                  {spotCategoryLabel(popupInfo.category)}
                </span>
                {/* Távolság megjelenítése, ha van */}
                {popupInfo.distance !== undefined && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    {Math.round((popupInfo.distance / 1000) * 10) / 10} km
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-1">{popupInfo.address}</p>

              {/* Ha van kép, mutathatunk egyet kicsiben */}
              {popupInfo.images && popupInfo.images.length > 0 && (
                <img
                  src={popupInfo.images[0]}
                  alt="Parkoló"
                  className="w-full h-24 object-cover rounded mt-2 bg-slate-100"
                />
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

// Kis segédfüggvény a szép megjelenítéshez
function spotCategoryLabel(category: string) {
  switch (category) {
    case 'FREE':
      return 'Ingyenes';
    case 'PAID':
      return 'Fizetős';
    case 'P_PLUS_R':
      return 'P+R';
    default:
      return category;
  }
}
