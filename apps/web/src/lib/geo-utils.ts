// Haversine formula a két pont közötti távolságra (méterben)
export function calculateDistanceInMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371e3; // Föld sugara méterben
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Formázó függvény (pl. "250 m" vagy "2.5 km")
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function openNavigationApp(lat: number, lng: number) {
  // Ellenőrzés, hogy böngészőben vagyunk-e (SSR védelem)
  if (typeof window === 'undefined') return;
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // iOS detektálás
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    window.open(`http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`, '_system');
  }
  // Android detektálás
  else if (/android/i.test(userAgent)) {
    window.location.href = `geo:${lat},${lng}?q=${lat},${lng}`;
  }
  // Desktop / Egyéb fallback
  else {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
      '_blank',
    );
  }
}
