'use client';

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

// --- MINTA ADATOK (Backend nélkül) ---
const dummySpots = [
  {
    id: '1',
    name: 'Ingyenes Murvás',
    lat: 47.4979,
    lng: 19.0402,
    category: 'FREE',
    address: 'Budapest, Pesti alsó rkp.',
  },
  {
    id: '2',
    name: 'Westend Tető',
    lat: 47.5126,
    lng: 19.0573,
    category: 'PAID',
    address: 'Budapest, Váci út 1-3.',
  },
  {
    id: '3',
    name: 'P+R Kelenföld',
    lat: 47.4653,
    lng: 19.0241,
    category: 'P_PLUS_R',
    address: 'Budapest, Etele tér',
  },
];

const INITIAL_VIEW_STATE = {
  latitude: 47.4979,
  longitude: 19.0402,
  zoom: 12,
  bearing: 0,
  pitch: 0,
};

export default function MapboxMap() {
  const { resolvedTheme } = useTheme();
  const [popupInfo, setPopupInfo] = React.useState<(typeof dummySpots)[0] | null>(null);

  // Referenciák az átméretezéshez
  const mapRef = React.useRef<MapRef>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);

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

        {/* A dummySpots tömböt járjuk be */}
        {dummySpots.map(spot => (
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
            <div className="p-2 min-w-[150px]">
              <h3 className="font-bold text-sm mb-1">{popupInfo.name}</h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {spotCategoryLabel(popupInfo.category)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{popupInfo.address}</p>
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
